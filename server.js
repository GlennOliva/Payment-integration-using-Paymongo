const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;


app.post("/checkout", async (req, res) => {
    const { amount, description } = req.body;
  
    if (amount < 50) {
      return res.status(400).json({ message: 'Amount must be at least 50 PHP' });
    }
  
    try {
      const session = await axios.post(
        "https://api.paymongo.com/v1/checkout_sessions",
        {
          data: {
            attributes: {
              payment_method_types: ["gcash"],
              line_items: [
                {
                  amount: amount * 100,
                  currency: "PHP",
                  name: description,
                  quantity: 1,
                },
              ],
              redirect: {
                success: "http://localhost:5173/home", // Redirect on success
                failed: "http://localhost:5173/fail",  // Redirect on failure
              },
            },
          },
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      res.status(200).json({
        message: "Checkout session created",
        checkout_url: session.data.data.attributes.checkout_url,
        payment_intent_id: session.data.data.id, // Add this to track payment status
      });
    } catch (error) {
      console.error("Error creating checkout session", error.response.data);
      res.status(500).json({ message: "Checkout session creation failed", error: error.response.data });
    }
  });
  
  
  
  // Add a route to check payment status by payment_intent_id
app.get("/payment-status/:payment_intent_id", async (req, res) => {
    const { payment_intent_id } = req.params;
  
    try {
      const paymentIntentResponse = await axios.get(
        `https://api.paymongo.com/v1/payment_intents/${payment_intent_id}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Check the payment status and return it
      const paymentStatus = paymentIntentResponse.data.data.attributes.status;
      res.status(200).json({ status: paymentStatus });
    } catch (error) {
      console.error("Error retrieving payment status", error.response.data);
      res.status(500).json({ message: "Failed to retrieve payment status", error: error.response.data });
    }
  });
  
  
  

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


