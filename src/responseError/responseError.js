class ResponseErr extends Error {
  #statusCode;
  constructor(statusCode, message) {
    super(message);
    this.#statusCode = statusCode;
  }

  get getStatusCode() {
    return this.#statusCode;
  }
}

export default ResponseErr;
