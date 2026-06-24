import { Course } from './Course';

export class Subject extends Course {
  static GRADE_POINTS = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'U': 0
  };

  constructor(code, name, credits, grade) {
    super(code, name, credits);
    this.grade = grade;
  }

  get grade() {
    return this._grade;
  }

  set grade(value) {
    const formattedGrade = value ? value.toUpperCase().trim() : 'U';
    if (!(formattedGrade in Subject.GRADE_POINTS)) {
      throw new Error(`Invalid grade: ${value}. Allowed grades are O, A+, A, B+, B, C, U.`);
    }
    this._grade = formattedGrade;
    this._gradePoint = Subject.GRADE_POINTS[formattedGrade];
  }

  get gradePoint() {
    return this._gradePoint;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      grade: this.grade,
      gradePoint: this.gradePoint
    };
  }
}
