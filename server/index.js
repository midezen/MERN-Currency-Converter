import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API_KEY = process.env.API_Key;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();

app.use(apiLimiter);
app.use(express.json());
app.use(cors());

app.post("/api/convert", async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await axios.get(url);
    if (response.data && response.data.result === "success") {
      res.json({
        base: from,
        target: to,
        conversionRate: response.data.conversion_rate,
        convertedAmount: response.data.conversion_result,
      });
    } else {
      res.json({
        message: "Error converting currency",
        details: response.data,
      });
    }
  } catch (error) {
    res.json({
      message: "Error converting currency",
      details: error.message,
    });
  }
});

app.listen(8000, () => {
  console.log("app is running on port 8000");
});
