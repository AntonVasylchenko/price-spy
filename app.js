import express from "express";
import "dotenv/config";
import "express-async-errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { security, errorHandlerMiddleware, notFoundMiddleware } from "./middleware/index.js";
import { PORT } from "./config.js";
import { observerRoutes, scheduleRoutes } from "./routes/index.js";
import bodyParser from "body-parser";
// client
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(security);

app.use(morgan("tiny"));

app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());

app.use("/api/observer", observerRoutes);
app.use("/api/schedule", scheduleRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
  });

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
