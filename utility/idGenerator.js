function uuidGenerate() {
  const crypto = require("crypto");
  const uuid = crypto.randomUUID();
  return uuid;
}

export default uuidGenerate;
