const bcrypt = require('bcrypt');
const User = require('../models/user.model')
const Employee = require('../models/employee.model');

const createEmployee = async (req, res) => {
    const { username, password, name, email, department, designation, phone, joinDate } = req.body;
    
    try {
        const [existingUser, existingEmployee] = await Promise.all([
            User.findOne({ username }),
            Employee.findOne({ email }),
        ]);

        if (existingUser && existingEmployee) {
            return res.status(400).json({ message: 'Username and Email are already taken' });
        }
        if (existingUser) {
            return res.status(400).json({ message: 'Username already in use' });
        }
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already assigned to another employee' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const employee = new Employee({
            name,
            email,
            department,
            designation,
            phone,
            joinDate
        });

        const savedEmployee = await employee.save();

        const user = new User({
            username,
            password: hashedPassword,
            role: 'employee',
            employee: savedEmployee._id,
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: 'Employee user created successfully',
            user: {
                id: savedUser.username,
                employee: savedEmployee
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create employee user', error: error.message });
    }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department');
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getEmployeesByDepartment = async (req, res) => {
    try {
        const { department } = req.query;
        if (!department) {
            return res.status(400).json({ message: 'Department ID is required' });
        }

        const employees = await Employee.find({ department });
        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found in this department' });
        }

        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

module.exports = { createEmployee, getAllEmployees, getEmployeesByDepartment };