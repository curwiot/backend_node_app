const { check, validationResult } = require('express-validator')

exports.validateLoginData = [
    check('Username')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('ID cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('Password')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('ID cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];