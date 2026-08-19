"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const adminController_1 = require("../controllers/adminController");
const adminController_2 = require("../controllers/adminController");
const router = express_1.default.Router();
function requireAdmin(req, res, next) {
    if (!(0, adminController_1.isAdminRequest)(req)) {
        return res.status(401).json({
            error: 'Admin credentials required',
        });
    }
    next();
}
router.post('/login', (0, asyncHandler_1.asyncHandler)(adminController_1.loginAdmin));
router.use(adminAuthMiddleware_1.adminAuthMiddleware);
router.get('/users', (0, asyncHandler_1.asyncHandler)(adminController_1.getUsers));
router.patch('/users/:userId/role', (0, asyncHandler_1.asyncHandler)(adminController_1.updateUserRole));
router.delete('/users/:userId', (0, asyncHandler_1.asyncHandler)(adminController_1.deleteUser));
// CUSTOMERS
router.get('/customers', requireAdmin, adminController_2.getCustomers);
router.post('/customers', requireAdmin, adminController_2.createCustomer);
//BOOKINGS
router.get('/bookings', requireAdmin, adminController_2.getBookings);
router.post('/bookings', requireAdmin, adminController_2.createBooking);
router.delete('/bookings/:bookingId', requireAdmin, adminController_2.deleteBooking);
// REWARDS
router.get('/rewards', requireAdmin, adminController_2.getRewards);
router.post('/rewards', requireAdmin, adminController_2.createReward);
router.patch('/rewards/:rewardId/status', requireAdmin, adminController_2.updateRewardStatus);
exports.default = router;
