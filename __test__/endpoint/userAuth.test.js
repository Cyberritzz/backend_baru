import app from "../../src/app";
import mongoose from "mongoose";
import supertest from "supertest";
import UserCol from "../../src/model/userCol";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

beforeAll(async function () {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));
});

afterAll(async function () {
  await mongoose.connection.close();
});

describe("Register User", () => {
  it("should success", async () => {
    const data = {
      fullname: "hasan",
      email: "hasan@gmail.com",
      contact: "089899909090",
      password: "123",
    };
    const res = await supertest(app).post("/register").send(data);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Account Registered");
  });

  it("should error email already exists", async () => {
    const data = {
      fullname: "hasankuy",
      email: "hasan@gmail.com",
      contact: "089899909090",
      password: "123",
    };
    const res = await supertest(app).post("/register").send(data);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(["Account already exists"]);
  });

  it("should error required", async () => {
    const data = {
      fullname: " ",
      email: " ",
      contact: " ",
      password: " ",
    };
    const res = await supertest(app).post("/register").send(data);

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([
      '"fullname" is not allowed to be empty',
      ' "email" is not allowed to be empty',
      ' "contact" is not allowed to be empty',
      ' "password" is not allowed to be empty',
    ]);
  });

  afterAll(async function () {
    await UserCol.deleteOne({ fullname: "hasan" });
  });
});

describe("Login User", () => {
  const data = {
    fullname: "testing",
    email: "testing@gmail.com",
    contact: "089283",
    password: "1234",
  };
  beforeAll(async function () {
    await supertest(app).post("/register").send(data);
  });
  it("should success", async () => {
    const res = await supertest(app).post("/login").send({
      email: data.email,
      password: data.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.get("Set-Cookie").length).toBe(1);

    await UserCol.deleteOne({ email: data.email });
  });

  it("should error required", async () => {
    const res = await supertest(app).post("/login").send({
      email: " ",
      password: " ",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual([
      '"email" is not allowed to be empty',
      ' "password" is not allowed to be empty',
    ]);
  });

  it("should error email not found", async () => {
    const res = await supertest(app).post("/login").send({
      email: "testing@gmail.com",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(["Check your email or password"]);
  });

  it("should error incorrect password", async () => {
    const res = await supertest(app).post("/login").send({
      email: data.email,
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(["Check your email or password"]);
  });

  afterAll(async function () {
    await UserCol.deleteOne({ email: data.email });
  });
});

describe("Logout User", () => {
  it("should success", async () => {
    const res = await supertest(app)
      .post("/logout")
      .set("Cookie", ["token=apalah"]);

    const token = res.get("Set-Cookie")[0].split(";")[0].split("=");
    expect(res.status).toBe(200);
    expect(token[1]).toBe("");
  });
});

describe("Forgot Password User", () => {
  const data = {
    fullname: "muiz",
    email: "muizzuddin334@gmail.com",
    contact: "089283",
    password: "1234",
  };
  it.skip("should success", async () => {
    const resRegister = await supertest(app).post("/register").send(data);
    expect(resRegister.statusCode).toBe(200);

    const res = await supertest(app)
      .post("/forgot-password")
      .send({ email: data.email });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Email has been sent and check your email");

    await UserCol.deleteOne({ email: data.email });
  });

  it("should email not found", async () => {
    const res = await supertest(app)
      .post("/forgot-password")
      .send({ email: "te@gmail.com" });

    expect(res.statusCode).toBe(404);
    expect(res.body.errors).toEqual(["Your email wrong"]);
  });

  afterAll(async function () {
    await UserCol.deleteOne({ email: data.email });
  });
});

describe("Reset Password User", () => {
  const data = {
    fullname: "muiz",
    email: "apa@gmail.com",
    contact: "089283",
    password: "1234",
  };
  beforeAll(async function () {
    await supertest(app).post("/register").send(data);
  });

  it("should success", async () => {
    const user = await UserCol.findOne({ email: data.email });

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: "5m", // 5 menit
    });

    const res = await supertest(app).post("/reset-password").send({
      newPassword: "123",
      token: token,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reset password successful");

    const resLogin = await supertest(app).post("/login").send({
      email: data.email,
      password: data.password,
    });

    expect(resLogin.statusCode).toBe(400);
    expect(resLogin.body.errors).toEqual(["Check your email or password"]);
  });

  it("should error token expired", async () => {
    const user = await UserCol.findOne({ email: data.email });

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 0,
    });

    const res = await supertest(app).post("/reset-password").send({
      newPassword: "123",
      token: token,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(["jwt expired"]);
  });
  it("should error objectID", async () => {
    const token = jwt.sign({ id: "7832989" }, process.env.SECRET_KEY, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: "5m",
    });

    const res = await supertest(app).post("/reset-password").send({
      newPassword: "123",
      token: token,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(["Token invalid"]);
  });

  afterAll(async function () {
    await UserCol.deleteOne({ email: data.email });
  });
});
