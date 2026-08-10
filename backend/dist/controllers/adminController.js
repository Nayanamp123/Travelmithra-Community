"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = loginAdmin;
exports.getUsers = getUsers;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
const adminService_1 = require("../services/adminService");
async function loginAdmin(req, res, next) {
    try {
        const { username, password } = req.body;
        const result = await (0, adminService_1.authenticateAdmin)(username, password);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
async function getUsers(req, res, next) {
    try {
        const users = await (0, adminService_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}
async function updateUserRole(req, res, next) {
    try {
        const userId = Number(req.params.userId);
        const { role } = req.body;
        if (!role) {
            return res.status(401).json({ error: 'Role is required' });
        }
        const user = await (0, adminService_1.changeUserRole)(userId, role);
        res.json({ message: 'Role updated successfully', user });
    }
    catch (error) {
        next(error);
    }
}
async function deleteUser(req, res, next) {
    try {
        const userId = Number(req.params.userId);
        await (0, adminService_1.removeUser)(userId);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}
