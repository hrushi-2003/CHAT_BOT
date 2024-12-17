import express from "express";
import { createAccount, getAllUsers } from "../controllers/user.controller";
const router = express.Router();

router.route("/signup").post(createAccount);
router.route("/get").get(getAllUsers);

export default router;
