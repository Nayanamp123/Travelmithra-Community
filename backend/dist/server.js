"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const corsMiddleware_1 = require("./middlewares/corsMiddleware");
const errorHandler_1 = require("./middlewares/errorHandler");
const database_1 = require("./repository/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 4000);
app.use(express_1.default.json());
(0, corsMiddleware_1.corsMiddleware)(app);
// Booking/customer reads must never be served from a browser, proxy, or CDN cache.
app.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});
app.get('/', (req, res) => {
    res.json({ message: 'Travelmithra backend running' });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/profile', profileRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/admin', adminRoutes_1.default);
app.use(errorHandler_1.errorHandler);
function listenWithFallback(portNumber) {
    return new Promise((resolve, reject) => {
        const server = app.listen(portNumber, () => {
            resolve(portNumber);
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE' && portNumber < 65535) {
                console.warn(`Port ${portNumber} is busy, trying ${portNumber + 1}...`);
                server.close(() => {
                    listenWithFallback(portNumber + 1).then(resolve).catch(reject);
                });
                return;
            }
            reject(error);
        });
    });
}
async function startServer() {
    try {
        // Do not start an apparently healthy API when PostgreSQL is unavailable.
        // Otherwise the frontend can report a successful-looking session update,
        // then lose all records on refresh because reads come from no database.
        await (0, database_1.initializeDatabase)();
        const listeningPort = await listenWithFallback(port);
        console.log(`Server running on http://localhost:${listeningPort}`);
    }
    catch (error) {
        console.error('Backend startup failed. Fix the database configuration and try again.');
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
startServer();
