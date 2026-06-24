import { Subject } from './Subject';

export class Semester {
  constructor(id, name, subjects = []) {
    this.id = id;
    this.name = name;
    this.subjects = subjects;
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
      throw new Error('Invalid semester name');
    }
    this._name = value.trim();
  }

  get subjects() {
    return this._subjects;
  }

  set subjects(value) {
    if (!Array.isArray(value)) {
      throw new Error('Subjects must be an array');
    }
    this._subjects = value.map(sub => {
      if (sub instanceof Subject) return sub;
      return new Subject(sub.code, sub.name, sub.credits, sub.grade);
    });
  }

  addSubject(subject) {
    if (!(subject instanceof Subject)) {
      subject = new Subject(subject.code, subject.name, subject.credits, subject.grade);
    }
    this._subjects.push(subject);
  }

  removeSubject(code) {
    this._subjects = this._subjects.filter(sub => sub.code !== code);
  }

  get totalCredits() {
    return this._subjects.reduce((sum, sub) => sum + sub.credits, 0);
  }

  get sgpa() {
    const totalCredits = this.totalCredits;
    if (totalCredits === 0) return 0;
    const totalPoints = this._subjects.reduce((sum, sub) => sum + (sub.credits * sub.gradePoint), 0);
    return Math.round((totalPoints / totalCredits) * 100) / 100;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      subjects: this.subjects.map(sub => sub.toJSON()),
      sgpa: this.sgpa,
      totalCredits: this.totalCredits
    };
  }
}
