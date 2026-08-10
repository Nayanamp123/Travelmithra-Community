"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = adminAuthMiddleware;
function adminAuthMiddleware(req, res, next) {
    const username = req.headers['x-admin-username'];
    const password = req.headers['x-admin-password'];
    const configuredUsername = process.env.ADMIN_USERNAME?.trim() || 'admin';
    const configuredPassword = process.env.ADMIN_PASSWORD?.trim() || 'admin123';
    if (typeof username === 'string' &&
        typeof password === 'string' &&
        username === configuredUsername &&
        password === configuredPassword) {
        return next();
    }
    return res.status(401).json({ error: 'Admin username and password required' });
}
