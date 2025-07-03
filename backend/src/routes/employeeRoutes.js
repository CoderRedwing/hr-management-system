const express = require('express');
const getMyProfile = require('../controllers/employeeController');
const { verifyToken, isEmployee } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Employee
 *   description: Employee profile and actions
 */

/**
 * @swagger
 * /api/employee/me:
 *   get:
 *     summary: Get logged-in employee profile
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee profile data
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', verifyToken, isEmployee, getMyProfile);

module.exports = router;
