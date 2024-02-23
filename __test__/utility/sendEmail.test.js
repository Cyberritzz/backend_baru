import Email from "../../src/utility/sendEmail";
import nodemailer from "nodemailer";

jest.mock("nodemailer");

describe("Email", () => {
  beforeEach(function () {
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ messageId: "123456" }),
    });
  });

  it("should success", async () => {
    const emailConfig = {
      from: "sender@example.com",
      to: "recipient@example.com",
      subject: "Test Subject",
      html: "<p>Test HTML Body</p>",
    };

    const email = new Email(emailConfig);
    const info = await email.send();

    expect(info.messageId).toBe("123456");
  });

  it("should create transporter with correct credentials", async () => {
    // Konfigurasi email
    const emailConfig = {
      from: "sender@example.com",
      to: "recipient@example.com",
      subject: "Test Subject",
      html: "<p>Test HTML Body</p>",
    };

    const email = new Email(emailConfig);
    await email.send();

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.SECRET_EMAIL_SENDER,
        pass: process.env.SECRET_EMAIL_AUTH,
      },
    });
  });
});
