import checkLimit from "../../src/middlewares/checkLimit";
import modelConstanta from "../../src/model/modelConstanta";
import UserCol from "../../src/model/userCol";
import ResponseErr from "../../src/responseError/responseError";

jest.mock("../../src/model/userCol");

describe("Check limit", () => {
  it("should success free", async () => {
    UserCol.findOne.mockResolvedValueOnce(
      Promise.resolve({
        is_membership: modelConstanta.isMembership.free,
        limit: 1,
      })
    );

    const req = {
      params: {
        id_user: "123",
      },
    };

    const next = jest.fn();

    await checkLimit(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(0);
  });

  it("should success not free", async () => {
    UserCol.findOne.mockResolvedValueOnce(
      Promise.resolve({
        is_membership: modelConstanta.isMembership.level1_lifetime,
        limit: 0,
      })
    );

    const req = {
      params: {
        id_user: "123",
      },
    };

    const next = jest.fn();

    await checkLimit(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(0);
  });

  it("should error unauthorized", async () => {
    UserCol.findOne.mockResolvedValueOnce(Promise.resolve(null));

    const req = {
      params: {
        id_user: "123",
      },
    };

    const next = jest.fn();

    await checkLimit(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(1);
    expect(next.mock.calls[0][0] instanceof ResponseErr).toBe(true);
    expect(next.mock.calls[0][0].message).toBe("Unauthorized");
    expect(next.mock.calls[0][0].getStatusCode).toBe(401);
  });

  it("should error limid reached", async () => {
    UserCol.findOne.mockResolvedValueOnce(
      Promise.resolve({
        is_membership: modelConstanta.isMembership.free,
        limit: 0,
      })
    );

    const req = {
      params: {
        id_user: "123",
      },
    };

    const next = jest.fn();

    await checkLimit(req, {}, next);

    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0].length).toBe(1);
    expect(next.mock.calls[0][0] instanceof ResponseErr).toBe(true);
    expect(next.mock.calls[0][0].message).toBe("Limit reached");
    expect(next.mock.calls[0][0].getStatusCode).toBe(403);
  });
});
