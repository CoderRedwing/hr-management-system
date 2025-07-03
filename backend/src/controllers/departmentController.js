const Department = require('../models/department.model');

const createDepartment = async (req, res) => {
    try {
        const department = new Department(req.body);
        const saved = await department.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
};

const getDepartments = async (req, res) => {
    try {
        const list = await Department.find();
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating department', error: error.message });
    }
}

const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department', error: error.message });
  }
};


module.exports = { createDepartment, getDepartments, updateDepartment, deleteDepartment };