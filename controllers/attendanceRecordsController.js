const { ObjectId } = require('mongodb');
const { getDb } = require('../database/mongoDB');

const addAttendanceRecord = async (req, res) => {
  const db = getDb();
  const { studentId, scheduleId, date, status } = req.body;
  try {
    const studentExists = await db.collection('students').findOne({ _id: ObjectId(studentId) });
    const scheduleExists = await db.collection('schedules').findOne({ _id: ObjectId(scheduleId) });

    if (!studentExists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!scheduleExists) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const attendanceRecord = {
      student_id: ObjectId(studentId),
      schedule_id: ObjectId(scheduleId),
      date: new Date(date),
      status,
    };

    const result = await db.collection('attendance_records').insertOne(attendanceRecord);
    return res.status(201).json(result.ops[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const getAttendanceRecords = async (req, res) => {
  const db = getDb();
  try {
    const attendanceRecords = await db.collection('attendance_records').find().toArray();
    return res.status(200).json(attendanceRecords);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { addAttendanceRecord, getAttendanceRecords };
