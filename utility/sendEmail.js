import nodemailer from "nodemailer";

class Email {
  #from = "";
  #to = "";
  #subject = "";
  #html = "";

  constructor(config) {
    this.#from = config.from;
    this.#to = config.to;
    this.#subject = config.subject;
    this.#html = config.html;
  }

  #createTransport() {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: process.env.SECRET_EMAIL_SENDER,
        pass: process.env.SECRET_EMAIL_AUTH,
      },
    });
    return transporter;
  }

  async send() {
    const transporter = this.#createTransport();
    const info = await transporter.sendMail({
      from: this.#from, // sender address
      to: this.#to, // list of receivers
      subject: this.#subject, // Subject line
      html: this.#html,
    });

    return info;
  }
}

export default Email;
