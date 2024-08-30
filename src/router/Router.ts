import express from "express";
import { getAllUsers, registerUser, validateUser } from "../controller/UserController";

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /prospects/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: integer
 *             required:
 *               - name
 *               - email
 *               - phone
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/prospects/register", validateUser, registerUser);

export default router;
