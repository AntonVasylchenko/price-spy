import express from "express";
import "dotenv/config";
import "express-async-errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { security,errorHandlerMiddleware,notFoundMiddleware } from "./middleware/index.js";
import { PORT } from "./config.js";
import { observerRoutes } from "./routes/index.js";

const app = express();

app.use(security);

app.use(morgan("tiny"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/observer",observerRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

async function startApp() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

startApp();
