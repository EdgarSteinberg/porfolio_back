import winston from "winston";
import __dirname from "./constants.js";

const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: "debug" })
    ]
});

// const prodLogger = new winston.createLogger({
//     transports: [
//         new winston.transports.Console({ level: "http" }),
//         new winston.transports.File({ level: 'warn', filename: `${__dirname}/logs/errors.log` })
//     ]
// });


const addLogger = (req, res, next) => {
    req.logger = devLogger;
    req.logger.warn(`${new Date().toDateString()} ${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
}

export default addLogger;