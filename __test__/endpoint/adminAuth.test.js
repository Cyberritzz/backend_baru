import app from "../../src/app";
import mongoose from "mongoose";
import supertest from "supertest";
import AdminCol from "../../src/model/adminCol";

beforeAll(async function () {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));
});

afterAll(async function () {
  await AdminCol.deleteOne({ username: "haskuy" });
  await mongoose.connection.close();
});

const data = {
  username: "haskuy",
  email: "hasksuy@gmail.com",
  password: "1234",
};

describe("Login", () => {
  it("should success", async () => {
    const resRegister = await supertest(app).post("/admin/register").send(data);
    expect(resRegister.statusCode).toBe(200);

    const res = await supertest(app)
      .post("/admin/login")
      .send({ email: data.email, password: data.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.id).not.toBeNull();
    expect(res.get("Set-Cookie").length).toBe(1);
  });

  it("should error required", async () => {
    const res = await supertest(app).post("/admin/login");

    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBe(2);
    expect(res.body.errors).toEqual([
      '"email" is required',
      ' "password" is required',
    ]);
  });

  it("should error not found", async () => {
    const res = await supertest(app)
      .post("/admin/login")
      .send({ email: "hash@gmail.com", password: "123" });

    expect(res.statusCode).toBe(404);
    expect(res.body.errors.length).toBe(1);
    expect(res.body.errors).toEqual(["Admin Not Found"]);
  });
});

describe("Logout", () => {
  it("should success", async () => {
    const res = await supertest(app)
      .post("/admin/logout")
      .set("Cookie", ["token=apalah"]);

    const token = res.get("Set-Cookie")[0].split(";")[0].split("=");
    expect(res.status).toBe(200);
    expect(token[1]).toBe("");
  });
});
