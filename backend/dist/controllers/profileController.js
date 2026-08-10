"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
const userService_1 = require("../services/userService");
async function getProfile(req, res, next) {
    try {
        const userId = Number(req.params.userId);
        const user = await (0, userService_1.getUserProfile)(userId);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}
async function updateProfile(req, res, next) {
    try {
        const userId = Number(req.params.userId);
        const { name, email, avatar } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const user = await (0, userService_1.editUserProfile)(userId, name, email, avatar);
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}
