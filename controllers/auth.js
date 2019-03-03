const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const HTTP_STATUS = require('../consts/httpStatus');
const cfg = require('../config/cfg');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (!candidate) {
        // User not found, error
        res.status(HTTP_STATUS.notFound)
        .json({message: 'Пользователь с таким email не найден'});
        return;
    }
    // check password, user exist
    const passwordResult = await bcrypt.compare(req.body.password, candidate.password);
    if (!passwordResult) {
        // password not matches, error
        res.status(HTTP_STATUS.unauthorizen)
        .json({message: 'Пароли не совпадают. Попробуйте снова.'})
    }
    // Generate token, password matches
    const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id,
    }, keys.jwt, {expiresIn: cfg.tokenTimeToLife});
    res.status(HTTP_STATUS.ok)
    .json({
        token: `Bearer ${token}`
    });
}

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
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