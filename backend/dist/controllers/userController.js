"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.updateRole = updateRole;
exports.deleteUser = deleteUser;
const userService_1 = require("../services/userService");
async function getAllUsers(req, res, next) {
    try {
        const users = await (0, userService_1.listUsers)();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}
async function updateRole(req, res, next) {
    try {
        const userId = Number(req.params.userId);
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }
        const user = await (0, userService_1.changeUserRole)(userId, role);
        res.json({ message: 'Role updated successfully', user });
    }
    catch (error) {
        next(error);
    }
}
async function deleteUser(req, res, next) {
    try {
        const userId = Number(req.params.userId);
        await (0, userService_1.removeUser)(userId);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}
