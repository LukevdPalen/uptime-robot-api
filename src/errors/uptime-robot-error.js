class UptimeRobotServerError extends Error {
  constructor(statusCode, message) {

    super();
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
  }
}

export default UptimeRobotServerError;
