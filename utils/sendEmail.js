const nodemailer = require("nodemailer");

export const sendEmail = async (data, headers) => {
  const userEMail = "revenuelegion@gmail.com";

  const emailPassword = process.env.SMTP_PASSWORD;

  console.log("emailPassword", emailPassword);

  const transporter = nodemailer.createTransport({
    host: "ams32.siteground.eu",
    port: 465,
    secure: true,
    auth: {
      user: "ricard@ricardcodes.com",
      pass: emailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log("error", error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const mailOptions = {
    from: "ricard@ricardcodes.com",
    to: userEMail,
    subject: "Test data from POST",
    text: `POST request body: ${data}. POST request headers: ${headers}`,
  };

  const response = await transporter.sendMail(mailOptions);
};
