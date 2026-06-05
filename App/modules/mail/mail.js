const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, message) => {
  const emailOptions = {
    from: process.env.SENDGRID_MAIL,
    to,
    subject,
    html: message,
  };
  try {
    await sgMail.send(emailOptions);
    console.log("Mail mandata con successo");
  } catch (e) {
    console.error(e);
    console.error("ERRORE SPECIFICO SENDGRID:", e.response?.body?.errors || e);
    throw new Error("Impossibile inviare la mail");
    throw new Error("Impossibile to send email, an error occurred");
  }
};

module.exports = { sendMail };
