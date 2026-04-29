import { Router } from "express";
import { razorpayWebhook } from "../controllers/webhook.controllers.js";

const router = Router();

router.route("/razorpay").post(razorpayWebhook);

export default router;
