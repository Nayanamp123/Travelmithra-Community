"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const authController_1 = require("../controllers/authController");
const adminAuthMiddleware_1 = require("../middlewares/adminAuthMiddleware");
const router = express_1.default.Router();
// Account creation is an admin-authorized operation. The new user still receives
// their own email/password and uses the normal login endpoint afterward.
router.post('/register', adminAuthMiddleware_1.adminAuthMiddleware, (0, asyncHandler_1.asyncHandler)(authController_1.register));
router.post('/login', (0, asyncHandler_1.asyncHandler)(authController_1.login));
exports.default = router;
