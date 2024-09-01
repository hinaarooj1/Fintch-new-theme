const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      //   secure: Boolean(process.env.SECURE),
      auth: {
        user: "admin@fintch.io",
        pass: "cat.ukKh&HLi)7#",
      },
    });

    let data = await transporter.sendMail({
      from: "admin@fintch.io",
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully", transporter, data);
  } catch (error) {
    console.log("email not sent!", email);
    console.log(error);
    return error;
  }
};
