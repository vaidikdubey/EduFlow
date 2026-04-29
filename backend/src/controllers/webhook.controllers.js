import { db } from "../db/db.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const razorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];

  if (!signature) throw new ApiError(400, "Missing webhook signature");

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body)
    .digest("hex");

  if (expectedSignature !== signature)
    throw new ApiError(400, "Invalid webhook signature");

  const event = JSON.parse(req.body.toString());

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    const razorpay_order_id = payment.order_id;
    const razorpay_payment_id = payment.id;

    const enrollment = await db.enrollment.findFirst({
      where: {
        paymentId: razorpay_order_id,
      },
    });

    if (!enrollment) {
      console.warn(
        "Webhook: Enrollment not found for order: ",
        razorpay_order_id,
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { received: true },
            "Enrollment not found, but payment received. Contact administration",
          ),
        );
    }

    if (enrollment.paymentStatus === "captured")
      return res
        .status(200)
        .json(
          new ApiResponse(200, { received: true }, "Payment already captured"),
        );

    await db.enrollment.update({
      where: {
        id: enrollment.id,
      },
      data: {
        paymentStatus: "captured",
        paidAt: new Date(),
        paymentId: razorpay_order_id,
      },
    });

    console.log("Webhook: Payment captured for order: ", razorpay_order_id);
  }

  if (event.event === "payment.failed") {
    const payment = event.payment.payment.entity;

    await db.enrollment.updateMany({
      where: {
        paymentId: payment.order_id,
        paymentStatus: "pending",
      },
      data: {
        paymentStatus: "failed",
      },
    });

    throw new ApiError(400, "Payment failed");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: "Payment successful, in webhook" },
        "Payment verified successfully",
      ),
    );
});

export { razorpayWebhook };
