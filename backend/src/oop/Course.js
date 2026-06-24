class Course {
  constructor(code, name, credits) {
    this.code = code;
    this.name = name;
    this.credits = credits;
  }

  get code() {
    return this._code;
  }

  set code(value) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('Invalid course code');
    }
    this._code = value.trim();
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('Invalid course name');
    }
    this._name = value.trim();
  }

  get credits() {
    return this._credits;
  }

  set credits(value) {
    const parsed = Number(value);
    if (isNaN(parsed) || parsed < 0) {
      throw new Error('Credits must be a non-negative number');
    }
    this._credits = parsed;
  }

  toJSON() {
    return {
      code: this.code,
      name: this.name,
      credits: this.credits
    };
  }
}

module.exports = Course;
