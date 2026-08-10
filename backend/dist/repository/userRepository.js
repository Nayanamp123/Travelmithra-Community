"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserByCredentials = findUserByCredentials;
exports.findUserByReferralCode = findUserByReferralCode;
exports.insertUser = insertUser;
exports.findUserById = findUserById;
exports.findAllUsersWithReferrer = findAllUsersWithReferrer;
exports.updateUserProfile = updateUserProfile;
exports.updateUserRole = updateUserRole;
exports.deleteUserById = deleteUserById;
exports.referralCodeExists = referralCodeExists;
const database_1 = require("./database");
function mapUserRow(row) {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        avatar: row.avatar ?? null,
        referralCode: row.referral_code,
        referredBy: row.referred_by ?? null,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        referredByName: row.referred_by_name ?? null,
    };
}
async function findUserByEmail(email) {
    const result = await (0, database_1.queryDatabase)('SELECT id, name, email, avatar, referral_code, referred_by, role FROM users WHERE email = $1', [email]);
    return result.rows.length > 0 ? mapUserRow(result.rows[0]) : null;
}
async function findUserByCredentials(email, passwordHash) {
    const result = await (0, database_1.queryDatabase)('SELECT id, name, email, avatar, referral_code, referred_by, role FROM users WHERE email = $1 AND password = $2', [email, passwordHash]);
    return result.rows.length > 0 ? mapUserRow(result.rows[0]) : null;
}
async function findUserByReferralCode(code) {
    const result = await (0, database_1.queryDatabase)('SELECT id FROM users WHERE referral_code = $1', [code]);
    return result.rows.length > 0 ? result.rows[0] : null;
}
async function insertUser(data) {
    const result = await (0, database_1.queryDatabase)('INSERT INTO users (name, email, password, referral_code, referred_by, role, sales_executive) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, avatar, referral_code, referred_by, role, sales_executive', [data.name, data.email, data.passwordHash, data.referralCode, data.referredBy, data.role, data.salesExecutive || null]);
    return mapUserRow(result.rows[0]);
}
async function findUserById(userId) {
    const result = await (0, database_1.queryDatabase)('SELECT id, name, email, avatar, referral_code, referred_by, role FROM users WHERE id = $1', [userId]);
    return result.rows.length > 0 ? mapUserRow(result.rows[0]) : null;
}
async function findAllUsersWithReferrer() {
    const result = await (0, database_1.queryDatabase)(`SELECT u.id, u.name, u.email, u.avatar, u.role, u.created_at, u.referral_code, u.referred_by, r.name AS referred_by_name
     FROM users u
     LEFT JOIN users r ON u.referred_by = r.id
     ORDER BY u.name ASC`);
    return result.rows.map(mapUserRow);
}
async function updateUserProfile(userId, name, email, avatar) {
    const result = await (0, database_1.queryDatabase)('UPDATE users SET name = $1, email = $2, avatar = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, avatar, referral_code, referred_by, role', [name, email, avatar ?? null, userId]);
    return result.rows.length > 0 ? mapUserRow(result.rows[0]) : null;
}
async function updateUserRole(userId, role) {
    const result = await (0, database_1.queryDatabase)('UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, avatar, referral_code, referred_by, role', [role, userId]);
    return result.rows.length > 0 ? mapUserRow(result.rows[0]) : null;
}
async function deleteUserById(userId) {
    const result = await (0, database_1.queryDatabase)('DELETE FROM users WHERE id = $1 RETURNING id, name, email, avatar, referral_code, referred_by, role', [userId]);
    return result.rows.length > 0 ? mapUserRow(result.rows[0]) : null;
}
async function referralCodeExists(code) {
    const result = await (0, database_1.queryDatabase)('SELECT id FROM users WHERE referral_code = $1', [code]);
    return result.rows.length > 0;
}
