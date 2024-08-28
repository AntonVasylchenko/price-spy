import { Router } from "express";
import { observerContollers } from "../controllers/index.js";

const router = Router();

router.route("/create").post(observerContollers.create);
router.route("/read/all").get(observerContollers.readAll);
router.route("/read/:id").get(observerContollers.read);
router.route("/update/:id").patch(observerContollers.update);
router.route("/delete/:id").delete(observerContollers.delete);

export default router;