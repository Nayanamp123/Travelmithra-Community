"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsMiddleware = corsMiddleware;
const cors_1 = __importDefault(require("cors"));
const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
exports.corsOptions = {
    origin(origin, callback) {
        // Allow requests without an Origin header
        // (Postman, server-to-server requests, etc.)
        if (!origin) {
            callback(null, true);
            return;
        }
        if (corsOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`CORS: Origin not allowed: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-admin-username',
        'x-admin-password',
    ],
    credentials: true,
};
function corsMiddleware(app) {
    app.use((0, cors_1.default)(exports.corsOptions));
    app.options('*', (0, cors_1.default)(exports.corsOptions));
}
