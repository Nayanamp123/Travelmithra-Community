"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    const status = typeof err === 'object' && err !== null && 'status' in err ? err.status : 500;
    const message = typeof err === 'object' && err !== null && 'message' in err
        ? err.message
        : 'Internal server error';
    const statusCode = typeof status === 'number' ? status : 500;
    if (statusCode >= 500) {
        console.error(err);
    }
    res.status(statusCode).json({ error: message });
}
