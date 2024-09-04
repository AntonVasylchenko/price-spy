import { Router } from "express";
import { scheduleContollers } from "../controllers/index.js";

const router = Router();

router.route("/start").post(scheduleContollers.start);
router.route("/check").post(scheduleContollers.check);
router.route("/stop").delete(scheduleContollers.stop);

export default router;