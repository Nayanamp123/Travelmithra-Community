"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.post('/login', (0, asyncHandler_1.asyncHandler)(adminController_1.loginAdmin));
router.use(adminAuthMiddleware_1.adminAuthMiddleware);
router.get('/users', (0, asyncHandler_1.asyncHandler)(adminController_1.getUsers));
router.patch('/users/:userId/role', (0, asyncHandler_1.asyncHandler)(adminController_1.updateUserRole));
router.delete('/users/:userId', (0, asyncHandler_1.asyncHandler)(adminController_1.deleteUser));
exports.default = router;
