import app from "../../src/app";
import mongoose from "mongoose";
import supertest from "supertest";
import AdminCol from "../../src/model/adminCol";

const dataRegister = {
  username: "haskuy",
  email: "hasksuy@gmail.com",
  password: "1234",
};

let token = "";

beforeAll(async function () {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));

  await supertest(app).post("/admin/register").send(dataRegister);
  const res = await supertest(app).post("/admin/login").send({
    email: dataRegister.email,
    password: dataRegister.password,
  });
  token = res.get("Set-Cookie")[0].split(";")[0].split("=")[1];
});

afterAll(async function () {
  await AdminCol.deleteOne({ username: dataRegister.username });
  await mongoose.connection.close();
});

describe("Get product", () => {
  it("should success", async () => {
    const res = await supertest(app)
      .get("/admin/dashboard/product")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("Get user", () => {
  it("should success", async () => {
    const res = await supertest(app)
      .get("/admin/dashboard/get-users")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
