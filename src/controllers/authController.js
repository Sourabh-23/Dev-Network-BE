const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.send('User created successfully');
  } catch (err) {
    res.status(400).send('User cannot be created : ' + err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('Invalid Credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(404).send('Invalid Credentials');
    }

    const token = await user.getJwt();

    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    const safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.password;

    res.send(safeUser);
  } catch (err) {
    res.status(400).send('Something went wrong ' + err.message);
  }
};

const logout = async (req, res) => {
  res.clearCookie('token');
  res.send('Logout successful');
};

module.exports = { signup, login, logout };
