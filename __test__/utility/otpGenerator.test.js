import otpGenerate from "../../src/utility/otpGenerator";

describe("otp generator", () => {
  it("should success", () => {
    const result = otpGenerate();
    expect(result.length).toBe(6);
  });
});
