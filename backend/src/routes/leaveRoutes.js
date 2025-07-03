const express = require('express');
const {
  requestLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require('../controllers/leaveController');
const { verifyToken, isAdmin, isEmployee } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Leave request and management
 */

/**
 * @swagger
 * /api/leaves:
 *   post:
 *     summary: Employee requests leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - reason
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Leave request submitted
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, isEmployee, requestLeave);

/**
 * @swagger
 * /api/leaves/me:
 *   get:
 *     summary: Employee views own leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employee’s leaves
 *       401:
 *         description: Unauthorized
 */
router.get('/me', verifyToken, isEmployee, getMyLeaves);

/**
 * @swagger
 * /api/leaves:
 *   get:
 *     summary: Admin views all leave requests
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All leave requests
 *       403:
 *         description: Admin access only
 */
router.get('/', verifyToken, isAdmin, getAllLeaves);

/**
 * @swagger
 * /api/leaves/{id}/status:
 *   put:
 *     summary: Admin approves or rejects a leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Leave ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Leave status updated
 *       403:
 *         description: Admin access only
 */
router.put('/:id/status', verifyToken, isAdmin, updateLeaveStatus);

module.exports = router;
