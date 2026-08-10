"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = authenticateAdmin;
exports.getAllUsers = getAllUsers;
exports.changeUserRole = changeUserRole;
exports.removeUser = removeUser;
const adminRepository_1 = require("../repository/adminRepository");
async function authenticateAdmin(username, password) {
    const configuredUsername = process.env.ADMIN_USERNAME?.trim() || 'admin';
    const configuredPassword = process.env.ADMIN_PASSWORD?.trim() || 'admin123';
    const submittedUsername = username?.trim();
    const submittedPassword = password?.trim();
    if (submittedUsername === configuredUsername && submittedPassword === configuredPassword) {
        return { message: 'Admin authenticated successfully', username: submittedUsername };
    }
    const error = new Error('Invalid admin username or password');
    error.status = 401;
    throw error;
}
async function getAllUsers() {
    return (0, adminRepository_1.findAllUsersWithReferrer)();
}
async function changeUserRole(userId, role) {
    const updated = await (0, adminRepository_1.updateUserRoleInRepository)(userId, role);
    if (!updated) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return updated;
}
async function removeUser(userId) {
    const deleted = await (0, adminRepository_1.deleteUserById)(userId);
    if (!deleted) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return deleted;
}
