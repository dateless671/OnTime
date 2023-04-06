const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAllAttendanceRecords);
router.get('/:id', attendanceController.getAttendanceRecordById);
router.post('/', attendanceController.createAttendanceRecord);
router.put('/:id', attendanceController.updateAttendanceRecord);
router.delete('/:id', attendanceController.deleteAttendanceRecord);

module.exports = router;
