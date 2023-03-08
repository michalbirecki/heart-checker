const nodemailer = require("nodemailer");

export const sendEmail = async (data, headers) => {
  console.log("email data", data);
  const userEMail = "revenuelegion@gmail.com";

  const emailPassword = process.env.SMTP_PASSWORD;

  // try converting body and heardr to JSON
  let bodyStr, headersStr;

  try {
    bodyStr = JSON.stringify(data);
    headersStr = JSON.stringify(headers);
  } catch {
    bodyStr = data;
    headersStr = data;
  }

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
    // text: `POST request body: ${bodyStr}. POST request headers: ${headersStr}`,
    html: `<p>POST request body: <br/>${bodyStr}</p><p>POST request headers:<br/> ${headersStr}</p>`,
  };

  const response = await transporter.sendMail(mailOptions);
};
