const LeaveRequest = require('../models/leaveRequest.model');


const requestLeave = async (req, res) => {
  try {
    const leave = new LeaveRequest({ ...req.body, employee: req.user.employeeId });
    const saved = await leave.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error requesting leave', error: error.message });
  }
};


const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user.employeeId });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave history', error: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const all = await LeaveRequest.find().populate('employee');
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const updated = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating leave status', error: error.message });
  }
};


module.exports = { requestLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };