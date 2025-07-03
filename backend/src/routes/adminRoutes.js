const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const {
  createEmployee,
  getAllEmployees,
  getEmployeesByDepartment,
} = require('../controllers/adminController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only operations
 */

/**
 * @swagger
 * /api/admin/employees:
 *   post:
 *     summary: Create a new employee (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               designation:
 *                 type: string
 *               phone:
 *                 type: string
 *               joinDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Validation error or duplicate entry
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.post('/employees', verifyToken, isAdmin, createEmployee);

/**
 * @swagger
 * /api/admin/employees:
 *   get:
 *     summary: Get all employees (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all employees
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/employees', verifyToken, isAdmin, getAllEmployees);

/**
 * @swagger
 * /api/admin/employees/by-department:
 *   get:
 *     summary: Get employees by department ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         required: true
 *         description: Department ID to filter employees
 *     responses:
 *       200:
 *         description: Employees fetched successfully
 *       400:
 *         description: Missing or invalid department ID
 *       404:
 *         description: No employees found in this department
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.get('/employees/by-department', verifyToken, isAdmin, getEmployeesByDepartment);

module.exports = router;
