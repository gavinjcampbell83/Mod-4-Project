// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const { validationResult } = require('express-validator');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Sign up
// router.post(
//     '/',
//     validateSignup,
//     async (req, res) => {
//       const { email, password, username, firstName, lastName} = req.body;
//       const hashedPassword = bcrypt.hashSync(password);
//       const user = await User.create({ email, username, hashedPassword, firstName, lastName});
  
//       const safeUser = {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         username: user.username
        
//       };
  
//       await setTokenCookie(res, safeUser);
  
//       return res.status(201).json({user: safeUser});
//     }
//   );

router.post(
  '/',
  validateSignup, 
  async (req, res, next) => {
    const { email, username, password, firstName, lastName } = req.body;

    const validationErrors = validationResult(req);
    const errors = {};

    if (!validationErrors.isEmpty()) {
      validationErrors.array().forEach(error => {
        errors[error.param] = error.msg;
      });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      errors.email = 'Email must be unique';
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      errors.username = 'Username must be unique';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      email,
      username,
      hashedPassword,
      firstName,
      lastName
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.status(201).json({ user: safeUser });
  }
);


module.exports = router;