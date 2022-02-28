const { check, validationResult } = require('express-validator')

exports.validateWeatherData = [
    check('ID')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('ID cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('PASSWORD')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('ID cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('data')
        .notEmpty()
        .withMessage('Data cannot be empty')
        .bail()
        .isLength({ min: 1 })
        .withMessage('Data Cannot be empty')
        .bail(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];