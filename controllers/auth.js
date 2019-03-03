const bcrypt = require('bcryptjs');
const User = require('../models/User');
const HTTP_STATUS = require('../consts/httpStatus');

module.exports.login = function (req, res) {
    res.status(200).json({
        login: {
            email: req.body.email,
            password: req.body.password,
        }
    });
}

module.exports.register = async function (req, res) {
    const condidate = await User.findOne({email: req.body.email});
    if (condidate) {
        // User Exists! Return the conflict status and message.
        res.status(HTTP_STATUS.conflict)
            .json({
                message: 'Такой email уже занет. Попробуйте другой.'
            });
        return;
    }
    
    // create user
    const salt = await bcrypt.genSalt(10);
    const password = req.body.password
    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(password, salt),
    });
    
    try {
        await user.save();
        res.status(HTTP_STATUS.created)
            .json(user)
    } catch (e) {
        // TODO handle error
    }
}