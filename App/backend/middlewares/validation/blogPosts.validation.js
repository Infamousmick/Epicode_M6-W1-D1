const { body, validationResult } = require("express-validator");
const BadRequestException = require("../../exception/BadRequestException");

const postValidationRules = [
  body("category").notEmpty().withMessage("La categoria è obbligatoria"),
  body("title").notEmpty().withMessage("Il titolo è obbligatorio"),
  body("cover")
    .optional()
    .isURL()
    .withMessage("La cover deve essere un URL valido"),
  body("readTime.value")
    .optional()
    .isNumeric()
    .withMessage("Il tempo di lettura deve essere un numero"),
  body("author").notEmpty().withMessage("L'autore è obbligatorio"),
  body("content")
    .notEmpty()
    .withMessage("Il contenuto del post è obbligatorio"),
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
    new BadRequestException(
      "Errore di  validazione dei dati del Post",
      extractedErrors,
    ),
  );
};

module.exports = { postValidationRules, validate };
