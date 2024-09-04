const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      service: "titan",
      port: 465,
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
    return null;
  } catch (error) {
    console.log("email not sent!", email);
    console.log(error);
    return error;
  }
};
