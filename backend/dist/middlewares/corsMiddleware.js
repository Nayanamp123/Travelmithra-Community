"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsMiddleware = corsMiddleware;
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];
exports.corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.some((allowedOrigin) => allowedOrigin.test(origin))) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-username', 'x-admin-password'],
};
function corsMiddleware(app) {
    app.use((0, cors_1.default)(exports.corsOptions));
    app.options('*', (0, cors_1.default)(exports.corsOptions));
}
