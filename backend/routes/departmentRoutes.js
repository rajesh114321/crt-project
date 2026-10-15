const express = require('express');
const router = express.Router();
const { 
  getAllDepartments, 
  getDepartmentById, 
  updateDepartment, 
  createDepartment 
} = require('../controllers/departmentController');

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.put('/:id', updateDepartment);
router.post('/', createDepartment);

module.exports = router;
