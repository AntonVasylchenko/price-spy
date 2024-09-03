import { PrismaClient } from '@prisma/client'
import customError from "../errors/index.js";
import StatusCodes from "http-status-codes";

import axios from 'axios';
import { parse } from 'node-html-parser';

import cron from "node-cron";

import CurrencyConverter from "currency-converter-lt"
import { shopify, session } from '../shopify/shopify.js';

const client = new shopify.clients.Graphql({ session });

const prisma = new PrismaClient();

const tasks = {};

async function fetchData(url, selector) {
    const response = await axios.get(url);
    const html = response.data;

    const root = parse(html);
    const element = root.querySelector(selector);

    return element ? element.text : null;
}

async function convertCurrency(rivalCurrency, productCurrency, currentPriceRival) {
    let currencyConverter = new CurrencyConverter({
        from: rivalCurrency,
        to: productCurrency,
        amount: currentPriceRival
    });

    try {
        let response = await currencyConverter.convert();
        return response; // Виведе конвертовану суму в доларах
    } catch (error) {
        console.error('Помилка конвертації валюти:', error);
    }
}

async function observerPrice(scheduleObject) {
    const price = await fetchData(scheduleObject.rivalLink, scheduleObject.htmlSelector);

    const currentPriceRival = parseInt(price) + 1;
    const oldPriceRival = parseInt(scheduleObject.rivalPrice);
    if (currentPriceRival !== oldPriceRival) {
        const { rivalCurrency, productCurrency } = scheduleObject

        const newPrice = String(await convertCurrency(rivalCurrency, productCurrency, currentPriceRival))

        const variantId = `gid://shopify/ProductVariant/${scheduleObject.productId}`;

        const mutation = `mutation updateProductVariantMetafields($input: ProductVariantInput!) {
            productVariantUpdate (input: $input) {
              productVariant {
                  id
                  price
              }
              userErrors {
                  message
                  field
              }
            }
          }`

        const variables = {
            variables: {
                input: {
                    id: variantId,
                    price: newPrice + 10
                }
            },
        };



        await client.request(mutation, variables);

        await prisma.product.update({
            where: {
                id: scheduleObject.productModelId
            },
            data: {
                price: newPrice
            }
        })

        console.log("Price was changed successfuly");

    }
}

async function createScheduleObject(observerId) {
    const observer = await prisma.observer.findUnique({ where: { id: observerId } });
    const product = await prisma.product.findUnique({ where: { id: observer.productId } });
    const rival = await prisma.rival.findUnique({ where: { id: observer.rivalId } });

    const scheduleObject = {
        time: observer.schedule,
        productHandle: product.handle,
        productId: product.shopifyId,
        productPrice: product.price,
        productCurrency: product.currency,
        productModelId: product.id,
        rivalPrice: rival.price,
        rivalLink: rival.link,
        rivalCurrency: rival.currency,
        htmlSelector: rival.selector
    }

    console.log(product);
    return scheduleObject
}


async function startSchedule(req, res) {
    const idTask = new Date().getTime();
    const { id } = req.body;

    const task = cron.schedule('*/10 * * * * *', async () => {
        console.log(132);
        try {
            const scheduleObject = await createScheduleObject(id)
            await observerPrice(scheduleObject)
            console.log('running a task every 10 second');
        } catch (error) {
            console.log(error);
            task.stop();
        }
    });

    tasks[idTask] = task

    console.log(idTask);

    res.status(StatusCodes.OK).json({
        msg: "Start schedule"
    });
}
async function stopSchedule(req, res) {
    const { id: idTask } = req.body

    tasks[idTask].stop()

    res.status(StatusCodes.OK).json({
        msg: "Stop schedule"
    });
}

const scheduleContollers = {
    start: startSchedule,
    stop: stopSchedule,
}

export default scheduleContollers