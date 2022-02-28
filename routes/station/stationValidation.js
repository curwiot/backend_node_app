const { check, validationResult } = require('express-validator')

exports.validStationData = [
    check('station_id')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('station_id cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('station_password')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('station_password cannot be empty')
        .bail()
        .isLength({ min: 4 })
        .withMessage('Minimum 4 characters required for the ID!')
        .bail(),
    check('station_name')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('station_name cannot be empty')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('latitude')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('latitude cannot be empty')
        .bail()
        .isLength({ min: 1 })
        .withMessage('Minimum 3 characters required for the ID!')
        .bail(),
    check('longitude')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('longitude cannot be empty')
        .bail(),
    check('station_type')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('station_type cannot be empty')
        .bail(),
    check('domestic_contact')
        .trim()
        .escape()
        .not()
        .notEmpty()
        .withMessage('domestic_contact cannot be empty')
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