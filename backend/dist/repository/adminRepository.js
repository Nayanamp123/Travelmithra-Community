"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllUsersWithReferrer = findAllUsersWithReferrer;
exports.updateUserRoleInRepository = updateUserRoleInRepository;
exports.deleteUserById = deleteUserById;
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
async function findAllUsersWithReferrer() {
    const result = await (0, database_1.queryDatabase)(`SELECT u.id, u.name, u.email, u.avatar, u.role, u.created_at, u.referral_code, u.referred_by, r.name AS referred_by_name
     FROM users u
     LEFT JOIN users r ON u.referred_by = r.id
     ORDER BY u.name ASC`);
    return result.rows.map(mapUserRow);
}
async function updateUserRoleInRepository(userId, role) {
    const result = await (0, database_1.queryDatabase)('UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, avatar, referral_code, referred_by, role, created_at, updated_at', [role, userId]);
    return result.rows.length > 0 ? mapUserRow(result.rows[0]) : null;
}
async function deleteUserById(userId) {
    const result = await (0, database_1.queryDatabase)('DELETE FROM users WHERE id = $1 RETURNING id, name, email, avatar, referral_code, referred_by, role, created_at, updated_at', [userId]);
    return result.rows.length > 0 ? mapUserRow(result.rows[0]) : null;
}
