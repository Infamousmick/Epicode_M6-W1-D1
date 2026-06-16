const HttpException = require("./index")

class BadRequestException extends HttpException {
    constructor(message, errors) {
        super(message || "Dati della richiesta non validi", 400, errors)
    }
}

module.exports = BadRequestException