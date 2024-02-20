import jwt from "jsonwebtoken";

function verifyToken(token, key) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, decode) => {
      if (err) {
        reject(err);
      } else {
        resolve(decode);
      }
    });
  });
}

export default verifyToken;
