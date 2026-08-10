"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
router.get('/:userId', (0, asyncHandler_1.asyncHandler)(profileController_1.getProfile));
router.put('/:userId', (0, asyncHandler_1.asyncHandler)(profileController_1.updateProfile));
exports.default = router;
