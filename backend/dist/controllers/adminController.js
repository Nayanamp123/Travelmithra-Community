"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = loginAdmin;
exports.isAdminRequest = isAdminRequest;
exports.getUsers = getUsers;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
exports.getCustomers = getCustomers;
exports.createCustomer = createCustomer;
exports.getBookings = getBookings;
exports.createBooking = createBooking;
exports.deleteBooking = deleteBooking;
exports.getRewards = getRewards;
exports.createReward = createReward;
exports.updateRewardStatus = updateRewardStatus;
const adminService_1 = require("../services/adminService");
const database_1 = require("../repository/database");
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
function getHeaderValue(value) {
    if (Array.isArray(value)) {
        return value[0]?.trim() || '';
    }
    return value?.trim() || '';
}
function isAdminRequest(req) {
    const username = getHeaderValue(req.headers['x-admin-username']);
    const password = getHeaderValue(req.headers['x-admin-password']);
    const adminUsername = process.env.ADMIN_USERNAME?.trim() || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD?.trim() || 'admin123';
    return (username === adminUsername &&
        password === adminPassword);
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
// CUSTOMERS
// ======================================================
async function getCustomers(req, res) {
    try {
        const result = await (0, database_1.queryDatabase)(`
      SELECT
        id,
        name,
        email,
        phone,
        trips,
        joined,
        active,
        created_at AS "createdAt"
      FROM admin_customers
      ORDER BY created_at DESC
    `);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({
            error: 'Failed to fetch customers',
        });
    }
}
async function createCustomer(req, res) {
    try {
        const { name, email, phone, password: customerPassword, trips, active, } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({
                error: 'Name, email, and phone are required',
            });
        }
        const joined = new Date().toLocaleDateString('en-IN');
        const result = await (0, database_1.queryDatabase)(`
      INSERT INTO admin_customers
        (
          name,
          email,
          phone,
          password,
          trips,
          joined,
          active
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        name,
        email,
        phone,
        trips,
        joined,
        active,
        created_at AS "createdAt"
      `, [
            name,
            email,
            phone,
            customerPassword || null,
            trips || 0,
            joined,
            active ?? true,
        ]);
        return res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create customer error:', error);
        return res.status(500).json({
            error: 'Failed to create customer',
        });
    }
}
// ======================================================
// BOOKINGS
// ======================================================
async function getBookings(req, res) {
    try {
        const result = await (0, database_1.queryDatabase)(`
      SELECT
        id,
        customer,
        route,
        date,
        amount,
        received,
        previous,
        adults,
        kids,
        executive,
        active,
        payment_mode AS "paymentMode",
        remarks,
        created_at AS "createdAt"
      FROM bookings
      ORDER BY created_at DESC
    `);
        return res.json(result.rows);
    }
    catch (error) {
        console.error('Get bookings error:', error);
        return res.status(500).json({
            error: 'Failed to fetch bookings',
        });
    }
}
async function createBooking(req, res) {
    try {
        const b = req.body;
        if (!b.customer ||
            !b.route ||
            !b.date ||
            !b.executive) {
            return res.status(400).json({
                error: 'Customer, route, date, and executive are required',
            });
        }
        const id = b.id || `TM-${Date.now()}`;
        const result = await (0, database_1.queryDatabase)(`
      INSERT INTO bookings
        (
          id,
          customer,
          route,
          date,
          amount,
          received,
          previous,
          adults,
          kids,
          executive,
          active,
          payment_mode,
          remarks
        )
      VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13
        )
      ON CONFLICT (id)
      DO UPDATE SET
        customer = EXCLUDED.customer,
        route = EXCLUDED.route,
        date = EXCLUDED.date,
        amount = EXCLUDED.amount,
        received = EXCLUDED.received,
        previous = EXCLUDED.previous,
        adults = EXCLUDED.adults,
        kids = EXCLUDED.kids,
        executive = EXCLUDED.executive,
        active = EXCLUDED.active,
        payment_mode = EXCLUDED.payment_mode,
        remarks = EXCLUDED.remarks
      RETURNING
        id,
        customer,
        route,
        date,
        amount,
        received,
        previous,
        adults,
        kids,
        executive,
        active,
        payment_mode AS "paymentMode",
        remarks,
        created_at AS "createdAt"
      `, [
            id,
            b.customer,
            b.route,
            b.date,
            b.amount || 0,
            b.received || 0,
            b.previous || 0,
            b.adults || 1,
            b.kids || 0,
            b.executive,
            b.active ?? true,
            b.paymentMode || 'BANK TRANSFER',
            b.remarks || '',
        ]);
        return res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create booking error:', error);
        return res.status(500).json({
            error: 'Failed to create booking',
        });
    }
}
async function deleteBooking(req, res) {
    try {
        const { bookingId } = req.params;
        if (!bookingId) {
            return res.status(400).json({
                error: 'Booking ID is required',
            });
        }
        const result = await (0, database_1.queryDatabase)(`
      DELETE FROM bookings
      WHERE id = $1
      RETURNING id
      `, [bookingId]);
        if (!result.rowCount) {
            return res.status(404).json({
                error: 'Booking not found',
            });
        }
        return res.json({
            success: true,
            id: result.rows[0].id,
            message: 'Booking deleted successfully',
        });
    }
    catch (error) {
        console.error('Delete booking error:', error);
        return res.status(500).json({
            error: 'Failed to delete booking',
        });
    }
}
// ======================================================
// REWARDS
// ======================================================
async function getRewards(req, res) {
    try {
        const result = await (0, database_1.queryDatabase)(`
      SELECT
        id,
        agent,
        traveler,
        booking_id AS "bookingId",
        amount,
        note,
        status,
        created_at AS "createdAt"
      FROM rewards
      ORDER BY created_at DESC
    `);
        return res.json(result.rows);
    }
    catch (error) {
        console.error('Get rewards error:', error);
        return res.status(500).json({
            error: 'Failed to fetch rewards',
        });
    }
}
async function createReward(req, res) {
    try {
        const { agent, traveler, bookingId, amount, note, } = req.body;
        if (!agent ||
            !traveler ||
            Number(amount) <= 0) {
            return res.status(400).json({
                error: 'Agent, traveler, and a positive reward amount are required',
            });
        }
        const result = await (0, database_1.queryDatabase)(`
      INSERT INTO rewards
        (
          agent,
          traveler,
          booking_id,
          amount,
          note
        )
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        agent,
        traveler,
        booking_id AS "bookingId",
        amount,
        note,
        status,
        created_at AS "createdAt"
      `, [
            agent,
            traveler,
            bookingId || null,
            Number(amount),
            note || '',
        ]);
        return res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Create reward error:', error);
        return res.status(500).json({
            error: 'Failed to create reward',
        });
    }
}
async function updateRewardStatus(req, res) {
    try {
        const { id } = req.params;
        const status = req.body.status === 'archived'
            ? 'archived'
            : null;
        if (!status) {
            return res.status(400).json({
                error: 'Invalid reward status',
            });
        }
        const result = await (0, database_1.queryDatabase)(`
      UPDATE rewards
      SET status = $1
      WHERE id = $2
      RETURNING id, status
      `, [status, id]);
        if (!result.rowCount) {
            return res.status(404).json({
                error: 'Reward not found',
            });
        }
        return res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Update reward error:', error);
        return res.status(500).json({
            error: 'Failed to update reward',
        });
    }
}
