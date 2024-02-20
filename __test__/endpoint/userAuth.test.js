import app from "../../src/app";
import mongoose from "mongoose";
import supertest from "supertest";
import UserCol from "../../src/model/userCol";

beforeAll(async function () {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));
});

afterAll(async function () {
  await UserCol.deleteOne({ fullname: "hasan" });
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
});
