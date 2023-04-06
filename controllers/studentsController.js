const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

exports.getStudents = async (req, res) => {
  try {
    const db = getDb();
    const students = await db.collection('students').find().toArray();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const student = await db.collection('students').findOne({ _id: ObjectId(id) });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.createStudent = async (req, res) => {
  const { name, email, qr_code } = req.body;
  try {
    const db = getDb();
    const result = await db.collection('students').insertOne({ name, email, qr_code, course_ids: [] });
    res.status(201).json({ _id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, qr_code } = req.body;
  try {
    const db = getDb();
    const result = await db.collection('students').updateOne(
      { _id: ObjectId(id) },
      { $set: { name, email, qr_code } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};

exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const result = await db.collection('students').deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};
