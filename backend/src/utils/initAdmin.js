const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const Department = require('../models/department.model');
require('dotenv').config();

const initAdmin = async () => {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('Admin already exists.');
    return;
  }


  let department = await Department.findOne({ name: 'Management' });
  if (!department) {
    department = await new Department({ name: 'Management' }).save();
    console.log('Default department "Management" created.');
  }


  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);

  const adminEmployee = new Employee({
    name: 'WartinHr',
    email: process.env.DEFAULT_ADMIN_EMAIL,
    department: department._id,
    designation: 'HR Admin',
    phone: '0000000000',
    joinDate: new Date(),
  });

  const savedEmployee = await adminEmployee.save();


  const adminUser = new User({
    username: process.env.DEFAULT_ADMIN_USERNAME,
    password: hashedPassword,
    role: 'admin',
    employee: savedEmployee._id,
  });

  await adminUser.save();

  console.log('Default admin user created.');
  console.log(`Username: ${process.env.DEFAULT_ADMIN_USERNAME}`);
  console.log(`Password: ${process.env.DEFAULT_ADMIN_PASSWORD}`);
};

module.exports = initAdmin;
