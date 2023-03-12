const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        errorMsg: err.message || 'Something went wrong, please try later!'

    }

    // if (err.name === "ValidationError") {
    //     customError.errorMsg = Object.values(err.errors).map(item => item.message).join(',')
    //     customError.statusCode = 400

    // }
    // if (err.name === 'CastError') {
    //     customError.errorMsg = `No item found with the id ${err.value}`
    //     customError.statusCode = 404

    // }
    if (err.code && err.code === 11000) {
        customError.errorMsg = ` duplicated value for the name or email field!`
        customError.statusCode = 400

    }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    return res.status(customError.statusCode).json({ msg: customError.errorMsg, code: customError.statusCode })


}

module.exports = errorHandlerMiddleware