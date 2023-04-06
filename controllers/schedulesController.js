const { ObjectId } = require('mongodb');
const qrCode = require('qrcode');
const dbClient = require('../db/dbClient');

async function createSchedule(req, res) {
  try {
    const { courseId, startTime, endTime, location } = req.body;

    // Generate QR code for the new schedule
    const qrCodeData = {
      type: 'schedule',
      id: new ObjectId().toString(),
    };
    const qrCodeImageUrl = await qrCode.toDataURL(JSON.stringify(qrCodeData));

    // Insert the new schedule into the database
    const result = await dbClient.db.collection('schedules').insertOne({
      courseId: ObjectId(courseId),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location,
      qrCode: qrCodeImageUrl,
      studentIds: [],
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: result.ops[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
    });
  }
}

async function getSchedule(req, res) {
  try {
    const { scheduleId } = req.params;
    const result = await dbClient.db.collection('schedules').findOne({ _id: ObjectId(scheduleId) });
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Schedule retrieved successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to get schedule',
    });
  }
}

async function addStudentToSchedule(req, res) {
  try {
    const { scheduleId, studentId } = req.params;
    const result = await dbClient.db.collection('schedules').updateOne(
      { _id: ObjectId(scheduleId) },
      { $push: { studentIds: ObjectId(studentId) } }
    );
    if (result.matchedCount === 1) {
      res.status(200).json({
        success: true,
        message: 'Student added to schedule successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to add student to schedule',
    });
  }
}

module.exports = {
  createSchedule,
  getSchedule,
  addStudentToSchedule,
};
