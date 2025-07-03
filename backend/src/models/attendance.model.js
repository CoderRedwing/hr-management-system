const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        requied: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    totalHours: {
        type: Number,
        default: 0
    }
}, { timestamps: true });


module.exports = mongoose.model('Attendance', attendanceSchema);