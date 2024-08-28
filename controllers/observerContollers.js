import { PrismaClient } from '@prisma/client'
import customError from "../errors/index.js";
import StatusCodes from "http-status-codes";

const prisma = new PrismaClient();

class ObserverHelper {
    constructor() {
        this.expectedIdLength = 24;
    }

    validateIdLength(id) {
        if (id.length !== this.expectedIdLength) {
            throw new customError.BadRequestError("Invalid ID format: ID length should be 24 characters");
        }
    }

    async ensureModelExists(modelName, id) {
        const record = await this.getSingleRecord(modelName, id);
        if (!record) {
            throw new customError.BadRequestError(`${modelName.charAt(0).toUpperCase() + modelName.slice(1)} with ID ${id} not found.`);
        }
        return record;
    }

    getSingleRecord(modelName, id) {
        return prisma[modelName].findUnique({
            where: { id }
        });
    }

    getMultipleRecords(modelName, id) {
        return prisma[modelName].findMany({
            where: { id }
        });
    }

    createSingleRecord(model, data) {
        return prisma[model].create({ data });
    }

    updateSingleRecord(modelName, id, payload) {
        return prisma[modelName].update({
            where: { id },
            data: payload
        });
    }

    removeSingleRecord(modelName, id) {
        return prisma[modelName].delete({
            where: { id }
        });
    }
}

const observerHelper = new ObserverHelper();

async function createObserver(req, res) {
    const { product, rival, observer } = req.body;

    const isExisted = await prisma.rival.findUnique({
        where: {
            link: rival.link
        }
    })

    if (isExisted) {
        throw new customError.BadRequestError(`This link ${rival.link} already existed. Please provide an unique value for the link`)
    }

    const isProduct = product ? true : false;
    const isRival = rival ? true : false;
    const isObserver = observer ? true : false;

    if (!isProduct || !isRival || !isObserver) {
        const textError = `${!isProduct ? "Product" : ""} ${!isRival ? "Rival" : ""} ${!isObserver ? "Observer" : ""}`;
        throw new customError.BadRequestError(`Please provide ${textError.trim()}`);
    }

    const productDB = await observerHelper.createSingleRecord('product', product);
    const rivalDB = await observerHelper.createSingleRecord('rival', rival);

    const observerData = { ...observer, productId: productDB.id, rivalId: rivalDB.id };
    const observerDB = await observerHelper.createSingleRecord('observer', observerData);

    await observerHelper.updateSingleRecord('product', productDB.id, { observerId: observerDB.id });
    await observerHelper.updateSingleRecord('rival', rivalDB.id, { observerId: observerDB.id });

    res.status(StatusCodes.OK).json({
        msg: "Observer created successfully",
        observer: { product: productDB, rival: rivalDB, observer: observerDB }
    });
}

async function readObserver(req, res) {
    const { id } = req.params;

    observerHelper.validateIdLength(id)

    const currentObserver = await observerHelper.ensureModelExists("observer", id);

    async function getExtraCollection(observer) {
        const { productId, rivalId } = observer;
        const product = await observerHelper.getSingleRecord("product", productId);
        const rival = await observerHelper.getSingleRecord("rival", rivalId);

        return {
            ...observer,
            product,
            rival
        };
    }

    const currentObserverWithDetails = await getExtraCollection(currentObserver);

    res.status(StatusCodes.OK).json({
        msg: "Observer retrieved successfully",
        observer: currentObserverWithDetails
    });
}

async function readAllObserver(req, res) {
    async function getExtraCollection(observer) {
        const { productId, rivalId } = observer

        const product = await observerHelper.getMultipleRecords("product", productId);
        const rival = await observerHelper.getMultipleRecords("rival", rivalId);

        return {
            ...observer,
            product,
            rival
        };
    }

    const observers = await prisma.observer.findMany();

    const observersWithDetails = await Promise.all(observers.map(getExtraCollection));

    res.status(StatusCodes.OK).json({
        msg: "Observers retrieved successfully",
        observers: observersWithDetails
    });
}

async function updateObserver(req, res) {
    const { id } = req.params;
    const { product, rival, observer } = req.body;

    observerHelper.validateIdLength(id)

    const existingObserver = await observerHelper.ensureModelExists("observer", id);

    const { productId, rivalId } = existingObserver;

    await Promise.all([
        observer && observerHelper.updateSingleRecord("observer", id, observer),
        product && observerHelper.updateSingleRecord("product", productId, product),
        rival && observerHelper.updateSingleRecord("rival", rivalId, rival)
    ])

    res.status(StatusCodes.OK).json({
        msg: "Observer updated successfully"
    });
}

async function deleteObserver(req, res) {
    const { id } = req.params;

    observerHelper.validateIdLength(id)

    const existingObserver = await observerHelper.ensureModelExists("observer", id);

    const { productId, rivalId } = existingObserver;

    await observerHelper.removeSingleRecord('observer', id);

    await Promise.all([
        observerHelper.removeSingleRecord('product', productId),
        observerHelper.removeSingleRecord('rival', rivalId)
    ]);

    res.status(StatusCodes.OK).json({ msg: "Observer and related records deleted successfully" });
}

const observerContollers = {
    create: createObserver,
    read: readObserver,
    readAll: readAllObserver,
    update: updateObserver,
    delete: deleteObserver
}

export default observerContollers