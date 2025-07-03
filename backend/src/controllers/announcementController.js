const Announcement = require('../models/announcement.model');


const createAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement({
            title: req.body.title,
            content: req.body.content,
            postedBy: req.user.userId,
        });

        const saved = await announcement.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const list = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements', error: error.message });
    }
};

module.exports = { createAnnouncement, getAnnouncements };