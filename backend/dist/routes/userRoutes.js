"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get('/', (0, asyncHandler_1.asyncHandler)(userController_1.getAllUsers));
router.patch('/:userId/role', (0, asyncHandler_1.asyncHandler)(userController_1.updateRole));
router.delete('/:userId', (0, asyncHandler_1.asyncHandler)(userController_1.deleteUser));
exports.default = router;
