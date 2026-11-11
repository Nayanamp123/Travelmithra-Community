"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const userService_1 = require("../services/userService");
const userRepository_1 = require("../repository/userRepository");
const teamLeadAuthMiddleware_1 = require("../middlewares/teamLeadAuthMiddleware");
async function register(req, res, next) {
    try {
        const { name, username, phone, password, avatar, referralCode, termsAccepted, consultantId, salesExecutive } = req.body;
        if (!name || !username || !phone || !password) {
            return res.status(400).json({ error: 'Name, username, phone, and password are required' });
        }
        if (termsAccepted !== true)
            return res.status(400).json({ error: 'You must agree to the agent rules and regulations' });
        // Every completed member registration is an agent. Keep the role and
        // consultant ID in their intended argument positions.
        const user = await (0, userService_1.registerUser)(name, username, phone, password, avatar, referralCode, true, 'agent', salesExecutive, consultantId);
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const { email, username, password } = req.body;
        const identifier = String(username || email || '').trim();
        if (!identifier || !password) {
            return res.status(400).json({ error: 'Email or customer name and password are required' });
        }
        if ((0, teamLeadAuthMiddleware_1.isConfiguredTeamLead)(identifier, password)) {
            const credentials = (0, teamLeadAuthMiddleware_1.getConfiguredTeamLeadCredentials)();
            return res.json({
                message: 'Team Lead login successful',
                user: {
                    id: 0,
                    name: credentials.username,
                    email: credentials.username,
                    referralCode: '',
                    referredBy: null,
                    role: 'team_lead',
                },
                bookings: [],
            });
        }
        const user = await (0, userService_1.loginUser)(identifier, password);
        const bookings = user.role === 'customer'
            ? await (0, userRepository_1.findApprovedBookingsForCustomer)(user.name)
            : [];
        res.json({ message: 'Login successful', user, bookings });
    }
    catch (error) {
        next(error);
    }
}
