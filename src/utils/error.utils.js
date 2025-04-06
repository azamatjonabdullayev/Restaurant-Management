export default class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.err_status = status;
  }
}
