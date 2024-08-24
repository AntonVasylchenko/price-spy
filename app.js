import express from "express";
import "dotenv/config";
import "express-async-errors";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { security } from "./middlewares/index.js";
import { PORT } from "./config.js";

const app = express();

app.use(security);

app.use(morgan("tiny"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

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
