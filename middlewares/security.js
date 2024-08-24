import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";

// Security middlewares
const security = [
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 120,
    }),
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'img-src': ["'self'", 'res.cloudinary.com', 'data:'],
            },
        },
    }),
    cors(),
    xss(),
];


export default security