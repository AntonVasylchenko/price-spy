import { PrismaClient } from '@prisma/client';
import customError from "../errors/index.js";
import StatusCodes from "http-status-codes";
import axios from 'axios';
import { parse } from 'node-html-parser';
import cron from "node-cron";
import CurrencyConverter from "currency-converter-lt";
import { shopify, session } from '../shopify/shopify.js';

const client = new shopify.clients.Graphql({ session });
const prisma = new PrismaClient();
const tasks = {};

async function fetchData(url, selector) {
    try {
        const response = await axios.get(url);
        const root = parse(response.data);
        const element = root.querySelector(selector);
        return element ? element.text.trim() : null;
    } catch (error) {
        throw new customError.BadRequestError('Failed to fetch data from URL');
    }
}

async function convertCurrency(fromCurrency, toCurrency, amount) {
    const currencyConverter = new CurrencyConverter({ from: fromCurrency, to: toCurrency, amount });
    try {
        return await currencyConverter.convert();
    } catch (error) {
        throw new customError.InternalServerError('Currency conversion failed');
    }
}

async function monitorPrice(scheduleObject) {
    const fetchedPrice = await fetchData(scheduleObject.rivalLink, scheduleObject.htmlSelector);
    if (!fetchedPrice) throw new customError.BadRequestError('Failed to fetch rival price');

    const currentPriceRival = parseFloat(fetchedPrice);
    const oldPriceRival = parseFloat(scheduleObject.rivalPrice) + 20;

    if (currentPriceRival !== oldPriceRival) {
        const convertedPrice = await convertCurrency(scheduleObject.rivalCurrency, scheduleObject.productCurrency, currentPriceRival);
        const newPrice = (convertedPrice).toFixed(2);

        await updateShopifyProductPrice(scheduleObject.productId, newPrice);
        await updateProductInDB(scheduleObject.productModelId, newPrice);

        console.log("Price was changed successfully");
    }
}

async function updateShopifyProductPrice(variantId, newPrice) {
    const mutation = `
        mutation updateProductVariantMetafields($input: ProductVariantInput!) {
            productVariantUpdate(input: $input) {
                productVariant {
                    id
                    price
                }
                userErrors {
                    message
                    field
                }
            }
        }`;

    const variables = {
        input: {
            id: `gid://shopify/ProductVariant/${variantId}`,
            price: newPrice,
        }
    };

    try {
        await client.request(mutation, { variables });
    } catch (error) {
        throw new customError.InternalServerError('Failed to update Shopify product price');
    }
}

async function updateProductInDB(productModelId, newPrice) {
    try {
        await prisma.product.update({
            where: { id: productModelId },
            data: { price: newPrice }
        });
    } catch (error) {
        throw new customError.InternalServerError('Failed to update product price in the database');
    }
}

async function createScheduleObject(productId, rivalId) {

    const product = await prisma.product.findUnique({ where: { id: productId } });
    const rival = await prisma.rival.findUnique({ where: { id: rivalId } });

    if (!product || !rival) throw new customError.BadRequestError('Related product or rival not found');

    return {
        productHandle: product.handle,
        productId: product.shopifyId,
        productPrice: product.price,
        productCurrency: product.currency,
        productModelId: product.id,
        rivalPrice: rival.price,
        rivalLink: rival.link,
        rivalCurrency: rival.currency,
        htmlSelector: rival.selector
    };
}

async function startSchedule(req, res) {
    const { id: observerId } = req.body;
    const observer = await prisma.observer.findUnique({ where: { id: observerId } });
    if (!observer) throw new customError.BadRequestError('Observer not found');

    const { productId, rivalId, schedule } = observer;

    const taskId = Date.now();


    console.log(schedule);
    
    const task = cron.schedule(schedule, async () => {
        try {
            const scheduleObject = await createScheduleObject(productId, rivalId);
            await monitorPrice(scheduleObject);
            console.log('Running a task every 10 seconds' + observerId);
        } catch (error) {
            console.error(error);
            task.stop();
        }
    });

    tasks[taskId] = task;

    res.status(StatusCodes.OK).json({
        msg: "Schedule started",
        taskId
    });
}

async function stopSchedule(req, res) {
    const { id: taskId } = req.body;

    if (tasks[taskId]) {
        tasks[taskId].stop();
        delete tasks[taskId];
        res.status(StatusCodes.OK).json({ msg: "Schedule stopped" });
    } else {
        res.status(StatusCodes.NOT_FOUND).json({ msg: "Task not found" });
    }
}

const scheduleControllers = {
    start: startSchedule,
    stop: stopSchedule,
};

export default scheduleControllers;