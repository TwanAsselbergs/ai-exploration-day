const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
  host: "smtp.strato.de",
  port: 587,
  secure: false,
  auth: {
    user: "email@snipegames.nl",
    pass: "EmailSpammah123!!",
  },
});

app.post("/send_email", (req, res) => {
  const { to, subject, message, emailCount } = req.body;
  const count = parseInt(emailCount, 10);

  let promises = [];
  for (let i = 0; i < count; i++) {
    const mailOptions = {
      from: "your-email@example.com",
      to: to,
      subject: `${subject} (Email ${i + 1})`,
      text: message,
    };

    promises.push(transporter.sendMail(mailOptions));
  }

  Promise.all(promises)
    .then(() => {
      res.json({ message: `${count} emails sent successfully!` });
    })
    .catch((error) => {
      console.error("Error sending emails:", error);
      res.status(500).json({ message: "Error sending emails." });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
