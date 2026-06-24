const User = require('../models/User');
const Student = require('../oop/Student');
const Semester = require('../oop/Semester');
const Subject = require('../oop/Subject');

const getStudentInstance = (userDoc) => {
  const semesters = userDoc.semesters.map(semDoc => {
    const subjects = semDoc.subjects.map(subDoc => {
      return new Subject(subDoc.code, subDoc.name, subDoc.credits, subDoc.grade);
    });
    return new Semester(semDoc._id.toString(), semDoc.name, subjects);
  });
  return new Student(userDoc._id.toString(), userDoc.name, userDoc.email, semesters);
};

exports.getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const student = getStudentInstance(user);
    res.json(student.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.addSemester = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ msg: 'Semester name is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.semesters.push({ name, subjects: [] });
    await user.save();

    const student = getStudentInstance(user);
    res.json(student.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.editSemester = async (req, res) => {
  const { name } = req.body;
  const { semesterId } = req.params;

  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ msg: 'Semester name is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const semester = user.semesters.id(semesterId);
    if (!semester) {
      return res.status(404).json({ msg: 'Semester not found' });
    }

    semester.name = name;
    await user.save();

    const student = getStudentInstance(user);
    res.json(student.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteSemester = async (req, res) => {
  const { semesterId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.semesters = user.semesters.filter(sem => sem._id.toString() !== semesterId);
    await user.save();

    const student = getStudentInstance(user);
    res.json(student.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.addSubject = async (req, res) => {
  const { semesterId } = req.params;
  const { code, name, credits, grade } = req.body;

  try {
    if (!code || !name || credits === undefined || !grade) {
      return res.status(400).json({ msg: 'Please provide all subject fields' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const semester = user.semesters.id(semesterId);
    if (!semester) {
      return res.status(404).json({ msg: 'Semester not found' });
    }

    const exists = semester.subjects.some(sub => sub.code.toLowerCase() === code.toLowerCase());
    if (exists) {
      return res.status(400).json({ msg: 'Subject code already exists in this semester' });
    }

    try {
      new Subject(code, name, credits, grade);
    } catch (validationError) {
      return res.status(400).json({ msg: validationError.message });
    }

    semester.subjects.push({ code, name, credits, grade });
    await user.save();

    const student = getStudentInstance(user);
    res.json(student.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.editSubject = async (req, res) => {
  const { semesterId, subjectId } = req.params;
  const { code, name, credits, grade } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const semester = user.semesters.id(semesterId);
    if (!semester) {
      return res.status(404).json({ msg: 'Semester not found' });
    }

    const subject = semester.subjects.id(subjectId);
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' });
    }

    if (code && code.toLowerCase() !== subject.code.toLowerCase()) {
      const exists = semester.subjects.some(sub => sub._id.toString() !== subjectId && sub.code.toLowerCase() === code.toLowerCase());
      if (exists) {
        return res.status(400).json({ msg: 'Subject code already exists in this semester' });
      }
    }

    try {
      new Subject(
        code || subject.code,
        name || subject.name,
        credits !== undefined ? credits : subject.credits,
        grade || subject.grade
      );
    } catch (validationError) {
      return res.status(400).json({ msg: validationError.message });
    }

    if (code) subject.code = code;
    if (name) subject.name = name;
    if (credits !== undefined) subject.credits = credits;
    if (grade) subject.grade = grade;

    await user.save();

    const student = getStudentInstance(user);
    res.json(student.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteSubject = async (req, res) => {
  const { semesterId, subjectId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const semester = user.semesters.id(semesterId);
    if (!semester) {
      return res.status(404).json({ msg: 'Semester not found' });
    }

    semester.subjects = semester.subjects.filter(sub => sub._id.toString() !== subjectId);
    await user.save();

    const student = getStudentInstance(user);
    res.json(student.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
