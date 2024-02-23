import authJwt from "../../src/middlewares/authJwt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import ResponseErr from "../../src/responseError/responseError";

describe("Verify Token", () => {
  it("should success", async () => {
    const signature = { id: "65803aa754fa938d441254ed", isAdmin: true };
    const token = jwt.sign(signature, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });
    const req = {
      cookies: {
        token: token,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await authJwt.verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(req.userId).toBe(signature.id);
    expect(req.isAdmin).toBe(signature.isAdmin);
  });

  it("should error token expired", async () => {
    const token = jwt.sign(
      { id: "65803aa754fa938d441254ed", isAdmin: true },
      process.env.SECRET_KEY,
      {
        expiresIn: 0,
      }
    );
    const req = {
      cookies: {
        token: token,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await authJwt.verifyToken(req, res, next);

    expect(next.mock.calls[0][0] instanceof jwt.JsonWebTokenError).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(req.userId).toBeUndefined();
    expect(req.isAdmin).toBeUndefined();
  });

  it("should error token invalid", async () => {
    const token = jwt.sign(
      { id: "65803aa754fa938d441254ed", isAdmin: true },
      "coba",
      {
        expiresIn: "1m",
      }
    );
    const req = {
      cookies: {
        token: token,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await authJwt.verifyToken(req, res, next);

    expect(next.mock.calls[0][0] instanceof jwt.JsonWebTokenError).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(req.userId).toBeUndefined();
    expect(req.isAdmin).toBeUndefined();
  });

  it("should error token objID", async () => {
    const token = jwt.sign(
      { id: "kjkjk", isAdmin: true },
      process.env.SECRET_KEY,
      {
        expiresIn: "1m",
      }
    );
    const req = {
      cookies: {
        token: token,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await authJwt.verifyToken(req, res, next);

    expect(next.mock.calls[0][0] instanceof ResponseErr).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(req.userId).toBeUndefined();
    expect(req.isAdmin).toBeUndefined();
  });

  it("should error is admin required", async () => {
    const token = jwt.sign(
      { id: "65803aa754fa938d441254ed" },
      process.env.SECRET_KEY,
      {
        expiresIn: "1m",
      }
    );
    const req = {
      cookies: {
        token: token,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await authJwt.verifyToken(req, res, next);

    expect(next.mock.calls[0][0] instanceof ResponseErr).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(req.userId).toBeUndefined();
    expect(req.isAdmin).toBeUndefined();
  });
});

describe("Is admin", () => {
  it("should success", () => {
    const req = {
      isAdmin: true,
    };
    const next = jest.fn();

    authJwt.isAdmin(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(0);
  });

  it("should error", () => {
    const req = {
      isAdmin: false,
    };
    const next = jest.fn();

    authJwt.isAdmin(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(1);
    expect(next.mock.calls[0][0] instanceof ResponseErr).toBe(true);
  });
});

describe("Is user", () => {
  it("should success", () => {
    const req = {
      isAdmin: false,
    };
    const next = jest.fn();

    authJwt.isUser(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(0);
  });

  it("should error", () => {
    const req = {
      isAdmin: true,
    };
    const next = jest.fn();

    authJwt.isUser(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(1);
    expect(next.mock.calls[0][0] instanceof ResponseErr).toBe(true);
  });
});

describe("Is not membership", () => {
  it("should ", () => {});
});
