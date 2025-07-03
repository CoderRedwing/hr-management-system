const Employee = require('../models/employee.model');

const getMyProfile = async (req, res) => {
    try {
        const employee = await Employee.findById(req.user.employeeId).populate('department');

        if (!employee) {
            return res.status(404).json({ message: 'Employee Not Found' });
        }

        res.status(200).json({ employee });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports =  getMyProfile;

