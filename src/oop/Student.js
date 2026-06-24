import { Semester } from './Semester';

export class Student {
  constructor(id, name, email, semesters = []) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.semesters = semesters;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('Invalid student name');
    }
    this._name = value.trim();
  }

  get email() {
    return this._email;
  }

  set email(value) {
    if (!value || typeof value !== 'string' || !value.includes('@')) {
      throw new Error('Invalid student email');
    }
    this._email = value.trim();
  }

  get semesters() {
    return this._semesters;
  }

  set semesters(value) {
    if (!Array.isArray(value)) {
      throw new Error('Semesters must be an array');
    }
    this._semesters = value.map(sem => {
      if (sem instanceof Semester) return sem;
      return new Semester(sem.id || sem._id || sem.name, sem.name, sem.subjects);
    });
  }

  addSemester(semester) {
    if (!(semester instanceof Semester)) {
      semester = new Semester(semester.id || semester._id || semester.name, semester.name, semester.subjects);
    }
    this._semesters.push(semester);
  }

  removeSemester(semesterId) {
    this._semesters = this._semesters.filter(sem => String(sem.id) !== String(semesterId));
  }

  get totalCredits() {
    return this._semesters.reduce((sum, sem) => sum + sem.totalCredits, 0);
  }

  get cgpa() {
    const totalCredits = this.totalCredits;
    if (totalCredits === 0) return 0;
    
    let totalPoints = 0;
    this._semesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        totalPoints += sub.credits * sub.gradePoint;
      });
    });

    return Math.round((totalPoints / totalCredits) * 100) / 100;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      semesters: this.semesters.map(sem => sem.toJSON()),
      cgpa: this.cgpa,
      totalCredits: this.totalCredits
    };
  }
}
