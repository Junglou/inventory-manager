import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import { ConnectDB } from "./configs/db.js";
import { aj } from "./lib/arcjet.js"; // Import arcjet instance

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("dev"));
app.use(cors());

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use("/api/products", productRoute);
app.use("/api/users", userRoute);

ConnectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
