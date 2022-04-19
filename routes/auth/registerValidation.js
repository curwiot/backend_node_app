const { check, validationResult } = require('express-validator')

exports.validateRegisterData = [
    check('Username')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('Username cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('Password')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('Password cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('Name')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('Position')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('Position cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('Email')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('Position cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail()
        .isEmail(),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];