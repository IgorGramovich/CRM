const HTTP_STATUS = require('../consts/httpStatus');

module.exports = (err, res) => {
    res.status(HTTP_STATUS.serverError)
    .json({
        success: false,
        message: err.message ? err.message : err,
    })
}