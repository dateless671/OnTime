const Course = require('../models/course');

exports.create = function (req, res) {
  const course = new Course({
    name: req.body.name,
    code: req.body.code,
  });

  course.save(function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating course', error: err });
    }
    return res.status(201).json(course);
  });
};

exports.getAll = function (req, res) {
  Course.find({}, function (err, courses) {
    if (err) {
      return res.status(500).json({ message: 'Error getting courses', error: err });
    }
    return res.status(200).json(courses);
  });
};

exports.getById = function (req, res) {
  Course.findById(req.params.id, function (err, course) {
    if (err) {
      return res.status(500).json({ message: 'Error getting course', error: err });
    }
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json(course);
  });
};

exports.update = function (req, res) {
  Course.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      code: req.body.code,
    },
    { new: true },
    function (err, course) {
      if (err) {
        return res.status(500).json({ message: 'Error updating course', error: err });
      }
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      return res.status(200).json(course);
    }
  );
};

exports.delete = function (req, res) {
  Course.findByIdAndDelete(req.params.id, function (err, course) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting course', error: err });
    }
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json({ message: 'Course deleted successfully' });
  });
};
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
