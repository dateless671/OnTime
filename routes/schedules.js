const express = require('express');
const router = express.Router();
const { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } = require('../controllers/schedules');

router.get('/', getSchedules);
router.get('/:id', getScheduleById);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
