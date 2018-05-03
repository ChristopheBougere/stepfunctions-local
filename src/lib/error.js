class CustomError extends Error {
  constructor(message, name) {
    super(message);
    if (name) this.name = name;
  }
}

module.exports = CustomError;
