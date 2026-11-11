"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUserProfile = getUserProfile;
exports.editUserProfile = editUserProfile;
exports.listUsers = listUsers;
exports.changeUserRole = changeUserRole;
exports.assignUserToTeamLead = assignUserToTeamLead;
exports.removeUser = removeUser;
const crypto_1 = __importDefault(require("crypto"));
const userRepository_1 = require("../repository/userRepository");
function hashPassword(password) {
    return crypto_1.default.createHash('sha256').update(password).digest('hex');
}
function generateReferralCode() {
    return crypto_1.default.randomBytes(4).toString('hex');
}
async function generateUniqueReferralCode() {
    let code = generateReferralCode();
    while (await (0, userRepository_1.referralCodeExists)(code)) {
        code = generateReferralCode();
    }
    return code;
}
function generateConsultantId() {
    return `TM-${crypto_1.default.randomInt(100000, 1000000)}`;
}
function normalizeReferralCode(referralCode) {
    const value = referralCode?.trim();
    if (!value) {
        return null;
    }
    try {
        const url = new URL(value);
        const codeFromQuery = url.searchParams.get('ref') ||
            url.searchParams.get('referralCode') ||
            url.searchParams.get('code');
        if (codeFromQuery?.trim()) {
            return codeFromQuery.trim();
        }
        const lastPathSegment = url.pathname.split('/').filter(Boolean).pop();
        return lastPathSegment?.trim() || null;
    }
    catch {
        return value;
    }
}
async function registerUser(name, username, phone, password, avatar, referralCode, termsAccepted = false, role = 'agent', salesExecutive, consultantId) {
    const existing = await (0, userRepository_1.findUserByEmail)(username);
    if (existing) {
        const error = new Error('Username already exists');
        error.status = 400;
        throw error;
    }
    let referredBy = null;
    const normalizedReferralCode = normalizeReferralCode(referralCode);
    if (normalizedReferralCode) {
        const referrer = await (0, userRepository_1.findUserByReferralCode)(normalizedReferralCode);
        if (referrer) {
            referredBy = referrer.id;
        }
    }
    const newReferralCode = await generateUniqueReferralCode();
    const passwordHash = hashPassword(password);
    return (0, userRepository_1.insertUser)({
        name,
        email: username,
        username,
        phone,
        avatar,
        termsAccepted,
        consultantId: consultantId || generateConsultantId(),
        passwordHash,
        referralCode: newReferralCode,
        referredBy,
        role,
        salesExecutive,
    });
}
async function loginUser(identifier, password) {
    const user = await (0, userRepository_1.findUserByCredentials)(identifier, hashPassword(password))
        || await (0, userRepository_1.findAdminCustomerByCredentials)(identifier, password);
    if (!user) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
    }
    return user;
}
async function getUserProfile(userId) {
    const user = await (0, userRepository_1.findUserById)(userId);
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return user;
}
async function editUserProfile(userId, name, email, avatar) {
    const updated = await (0, userRepository_1.updateUserProfile)(userId, name, email, avatar);
    if (!updated) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return updated;
}
async function listUsers() {
    return (0, userRepository_1.findAllUsersWithReferrer)();
}
async function changeUserRole(userId, role) {
    const updated = await (0, userRepository_1.updateUserRole)(userId, role);
    if (!updated) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return updated;
}
async function assignUserToTeamLead(userId, salesExecutive) {
    const updated = await (0, userRepository_1.updateUserSalesExecutive)(userId, salesExecutive);
    if (!updated) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return updated;
}
async function removeUser(userId) {
    const deleted = await (0, userRepository_1.deleteUserById)(userId);
    if (!deleted) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return deleted;
}
