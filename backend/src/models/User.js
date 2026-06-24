const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SubjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 0
  },
  grade: {
    type: String,
    required: true,
    enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'U'],
    default: 'U'
  }
});

const SemesterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subjects: [SubjectSchema]
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  semesters: [SemesterSchema]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
