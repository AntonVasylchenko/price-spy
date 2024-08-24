import express from "express";
import "dotenv/config";
import "express-async-errors";

// Dev Library
import morgan from "morgan";

// CORS
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 120,
    })
);
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'img-src': ["'self'", 'res.cloudinary.com', 'data:'],
            },
        },
    })
);

app.use(cors());
app.use(xss());

app.use(morgan("tiny"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



async function startApp() {
    try {
        app.listen(PORT, () => {
            console.log("Server was started");
        });
    } catch (error) {
        console.log(error);
    }
}

startApp();


  
