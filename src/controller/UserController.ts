import { Request, Response } from "express";
const SibApiV3Sdk = require('sib-api-v3-sdk');
const dotenv = require("dotenv");
const { customAlphabet } = require('nanoid');
import { body, validationResult } from "express-validator";
import { query } from "../db";

interface User {
    name: string;
    email: string;
    phone: number;
}

// Validation middleware
export const validateUser = [
    body('name')
        .isString().withMessage("Invalid 'name' field, expected a string."),
    body('email')
        .isEmail().withMessage("Invalid 'email' field, expected a valid email."),
    body('phone')
        .isNumeric().withMessage("Invalid 'phone' field, expected a number.")
        .isLength({ min: 10, max: 10 }).withMessage("Invalid 'phone' field, expected exactly 10 digits."),
];

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     responses:
 *       200:
 *         description: A list of users
 */

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM usertable');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

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
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */

const registerUser = async (req: Request, res: Response) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone } = req.body;

    const user: User = { name, email, phone };

    const nanoId = customAlphabet('0123456789', 4)
    const verification_code = nanoId();

    try {
        const result = await query(
            `INSERT INTO prospects (name, email, phone,verification_code) VALUES ($1, $2, $3,$4) RETURNING *`,
            [name, email, phone,verification_code]
        );
        res.status(201).json(result.rows[0]); // Return the inserted row

        // Create an instance of the API client
        const defaultClient = SibApiV3Sdk.ApiClient.instance;

        // Configure API key authorization
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.SENDGRID_API_KEY; // Replace with your actual API key

        // Create an instance of the TransactionalEmailsApi
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        

        const sendSimpleEmail = {
        sender: {
            email: "info@allfundscloud.in",
            name: "Moneta"
        },
        to: [{
            email,
            name
        }],
        templateId: 5,
            params: {
                otp: verification_code
            },
        };

        apiInstance.sendTransacEmail(sendSimpleEmail).then(function(data) {
            console.log('API called successfully. Returned data: ', data);
        }).catch(function(error) {
        console.error('Error occurred: ', error.response ? error.response.body : error);
        });


    } catch (error) {
        console.error("Database insertion error:", error);
        res.status(500).send('Internal Server Error');
    }
};

export { getAllUsers, registerUser };
