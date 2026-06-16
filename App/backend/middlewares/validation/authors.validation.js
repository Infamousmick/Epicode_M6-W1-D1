const { body, validationResult } = require("express-validator");
const BadRequestException = require("../../exception/BadRequestException");

const authorValidationRules = [
  body("firstName")
    .notEmpty()
    .withMessage("Il nome è obbligatorio")
    .isLength({ max: 20 }),
  body("lastName")
    .notEmpty()
    .withMessage("Il cognome è obbligatorio")
    .isLength({ max: 20 }),
  body("email").isEmail().withMessage("Inserisci un indirizzo email valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La password deve essere lunga almeno 8 caratteri"),
  body("dateOfBirth")
    .notEmpty()
    .withMessage("La data di nascia è obbligatotia"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  next(
    new BadRequestException("Errore di validazione dei dati", extractedErrors),
  );
};

module.exports = {
  authorValidationRules,
  validate,
};
