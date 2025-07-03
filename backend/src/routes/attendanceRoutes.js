const express = require('express');
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} = require('../controllers/attendanceController');
const { verifyToken, isAdmin, isEmployee } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Employee attendance tracking
 */

/**
 * @swagger
 * /api/attendance/check-in:
 *   post:
 *     summary: Employee manual check-in
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Check-in successful
 *       400:
 *         description: Already checked in
 *       401:
 *         description: Unauthorized
 */
router.post('/check-in', verifyToken, isEmployee, checkIn);

/**
 * @swagger
 * /api/attendance/check-out:
 *   post:
 *     summary: Employee manual check-out
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Check-out successful
 *       400:
 *         description: Already checked out or not checked in
 *       401:
 *         description: Unauthorized
 */
router.post('/check-out', verifyToken, isEmployee, checkOut);

/**
 * @swagger
 * /api/attendance/me:
 *   get:
 *     summary: Get logged-in employee’s attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee attendance history
 *       401:
 *         description: Unauthorized
 */
router.get('/me', verifyToken, isEmployee, getMyAttendance);

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Admin gets all employee attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All employee attendance records
 *       403:
 *         description: Forbidden – Admin only
 */
router.get('/', verifyToken, isAdmin, getAllAttendance);

module.exports = router;
