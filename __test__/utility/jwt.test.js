import verifyToken from "../../src/utility/jwt";
import jwt from "jsonwebtoken";

describe("Verify token", () => {
  it("should success", async () => {
    const token = jwt.sign({ id: 1 }, "coba", {
      expiresIn: "1m",
    });

    const decoded = await verifyToken(token, "coba");
    expect(decoded.id).toBe(1);
  });
  it("should token expired", async () => {
    try {
      const token = jwt.sign({ id: 1 }, "coba", {
        expiresIn: 0,
      });

      await verifyToken(token, "coba");
    } catch (err) {
      expect(err instanceof jwt.JsonWebTokenError).toBe(true);
    }
  });
});
