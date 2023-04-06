const express = require('express');
const router = express.Router();
const { getAttendanceRecords, getAttendanceRecordById, createAttendanceRecord, updateAttendanceRecord, deleteAttendanceRecord } = require('../controllers/attendance_records');

router.get('/', getAttendanceRecords);
router.get('/:id', getAttendanceRecordById);
router.post('/', createAttendanceRecord);
router.put('/:id', updateAttendanceRecord);
router.delete('/:id', deleteAttendanceRecord);

module.exports = router;
