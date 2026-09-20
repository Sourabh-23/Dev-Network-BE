const Razorpay = require("razorpay");

const razorpayInstance = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : {
      orders: {
        create: async () => {
          throw new Error("Razorpay credentials are not configured");
        },
      },
    };

module.exports = razorpayInstance;
