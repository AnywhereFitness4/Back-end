//* This Middleware is to validate the user req.body, to ensure no empty data from Required fields are missing

// Validate body of login request
const userLogin = (req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    res
      .status(400)
      .json({ message: "Please provide a username and password!" });
  } else {
    next();
  }
};

// Validate body of registration request
const userReg = (req, res, next) => {
  const user = req.body;

  if (
    !user.name ||
    !user.email ||
    !user.username ||
    !user.password ||
    !user.role
  ) {
    res.status(400).json({
      message: "Please provide a name, email, username, password, role!",
    });
  } else {
    next();
  }
};

// Validate body of update request
const bcrypt = require("bcryptjs");

const userUpdate = (userModel) => async (req, res, next) => {
  const userData = req.body;
  const { id } = req.params;

  // Check if password is empty. If it is empty, add the one from the database
  if (!userData.password) {
    const { password } = await userModel.getUserBy("id", id);
    userData.password = password;
  } else {
    const hash = bcrypt.hashSync(userData.password);
    userData.password = hash;
  }

  if (
    !userData.name ||
    !userData.email ||
    !userData.username ||
    !userData.password ||
    !userData.role
  ) {
    res.status(400).json({
      message: "Please provide a name, email, username, role!",
    });
  } else {
    req.userData = userData;
    next();
  }
};

module.exports = {
  userLogin,
  userReg,
  userUpdate,
};
