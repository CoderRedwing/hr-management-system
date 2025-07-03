const express = require('express');
const {
  createAnnouncement,
  getAnnouncements,
} = require('../controllers/announcementController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Announcement
 *   description: Company announcements
 */

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: View all announcements
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of announcements
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, getAnnouncements);

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: Post a new announcement (Admin only)
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Announcement posted
 *       403:
 *         description: Admin access required
 */
router.post('/', verifyToken, isAdmin, createAnnouncement);

module.exports = router;
