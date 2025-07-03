const Attendance = require('../models/attendance.model');

const checkIn = async (req, res) => {
    const today = new Date().toDateString();

    try {
        const alreadyCheckedIn = await Attendance.findOne({
            employee: req.user.employeeId,
            date: today,
        });

        if (alreadyCheckedIn) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const record = new Attendance({
            employee: req.user.employeeId,
            date: today,
            checkIn: new Date(),
        });

        await record.save();
        res.status(201).json({ message: 'Check-in successful', record });
    } catch (error) {
        res.status(500).json({ message: 'Error checking in', error: error.message });
    }
};

const checkOut = async (req, res) => {
    const today = new Date().toDateString();

    try {
        const record = await Attendance.findOne({
            employee: req.user.employeeId,
            date: today,
        });

        if (!record || record.checkOut) {
            return res.status(400).json({ message: 'Check-in not found or already checked out' });
        }

        const now = new Date();
        const diff = (now - new Date(record.checkIn)) / (1000 * 60 * 60); // in hours

        record.checkOut = now;
        record.totalHours = parseFloat(diff.toFixed(2));

        await record.save();
        res.status(200).json({ message: 'Check-out successful', record });
    } catch (error) {
        res.status(500).json({ message: 'Error checking out', error: error.message });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const list = await Attendance.find({ employee: req.user.employeeId });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        const all = await Attendance.find().populate('employee');
        res.status(200).json(all);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all attendance', error: error.message });
    }
};


module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance };
