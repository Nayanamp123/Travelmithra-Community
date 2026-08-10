"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const userService_1 = require("../services/userService");
async function register(req, res, next) {
    try {
        const { name, email, password, referralCode, role, salesExecutive } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        const allowedRoles = ['traveler', 'admin', 'agent', 'sales_executive'];
        if (role && !allowedRoles.includes(role))
            return res.status(400).json({ error: 'Invalid role' });
        if (role === 'sales_executive' && !['Aliya', 'Keerthi'].includes(salesExecutive))
            return res.status(400).json({ error: 'Choose Aliya or Keerthi' });
        const user = await (0, userService_1.registerUser)(name, email, password, referralCode, role || 'traveler', salesExecutive);
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await (0, userService_1.loginUser)(email, password);
        res.json({ message: 'Login successful', user });
    }
    catch (error) {
        next(error);
    }
}
