import ErrorCodes from "../../service/errors/enums.js";

const middlewareError = (error, req, res, next) => {
    console.log('Error details:', error.cause);

    switch (error.code) { 
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.name });
            break;
        default:
            res.status(500).send({ status: 'error', error: 'Unhandled error' });
    }
}


export default middlewareError;