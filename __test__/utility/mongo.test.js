import isObjectID from "../../src/utility/mongo";

describe("Isobject ID", () => {
  it("should success", () => {
    const id = "65803aa754fa938d441254ed";
    const result = isObjectID(id);

    expect(result).toBe(true);
  });

  it("should error", () => {
    const id = "4390420930";
    const result = isObjectID(id);

    expect(result).toBe(false);
  });
});
