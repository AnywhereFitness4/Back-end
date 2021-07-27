//* Import express and setup router
const express = require("express");
const router = express.Router();

//* Import necessary security/authentication modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

//* Import models
const User = require("./users-model");

//* Import Middleware
const validateUserBody = require("../middleware/validateUserBody");
const checkDuplicateRecords = require("../middleware/checkDuplicateRecords");
const checkIfExists = require("../middleware/checkIfExists");
const restrictAccess = require("../middleware/restrictAccess");

//* Setup API Endpoints

//-- [POST]
// User Registration
router.post(
  "/register",
  [validateUserBody.userReg, checkDuplicateRecords.users(User)],
  (req, res) => {
    const userData = req.body;

    // Hash the password
    const hash = bcrypt.hashSync(userData.password, 10);
    userData.password = hash;

    User.createUser(userData)
      .then((user) => {
        res
          .status(201)
          .json({ message: "User has been created successfully!" });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Error registering user in", error: err.message });
      });
  }
);

// User Login
router.post("/login", validateUserBody.userLogin, (req, res) => {
  const { username, password } = req.body;

  User.getUserBy("username", username)
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res
          .status(200)
          .json({ message: `Welcome ${user.name}`, userId: user.id, token });
      } else {
        res.status(403).json({ message: "Invalid username or password" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error logging user in", error: err.message });
    });
});

//-- [GET]
// Get all users TEMP
router.get("/", (req, res) => {
  User.getAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error getting all users", error: err.message });
    });
});

// Get a user by ID
router.get("/:id", restrictAccess, (req, res) => {
  const { id } = req.params;

  User.getUserBy("id", id)
    .then((user) => {
      if (user) {
        const userObj = {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        };

        res.status(200).json(userObj);
      } else {
        res.status(404).json({ message: "User with such ID does not exist" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error getting user", error: err.message });
    });
});

// Get all classes from an isntructor
router.get("/:id/instructor", checkIfExists.users(User), (req, res) => {
  const { id } = req.params;

  User.getMyClasses(id)
    .then((classes) => {
      if (classes.length) {
        res.status(200).json(classes);
      } else {
        res.status(200).json({ message: "This instructor has no classes" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error getting instructor's classes",
        error: err.message,
      });
    });
});

// Get all classes from an attendee
router.get("/:id/attendee", checkIfExists.users(User), (req, res) => {
  const { id } = req.params;

  User.getMyReservations(id)
    .then((classes) => {
      if (classes.length) {
        res.status(200).json(classes);
      } else {
        res
          .status(200)
          .json({ message: "This user has not registered to any classes" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error getting attendees' classes",
        error: err.message,
      });
    });
});

// Get all classes that a user is attending

//-- [PUT]
// User Edit
router.put(
  "/:id",
  [
    checkIfExists.users(User),
    restrictAccess,
    validateUserBody.userUpdate(User),
  ],
  (req, res) => {
    const { id } = req.params;
    const userData = req.userData;

    User.updateUser(userData, id)
      .then(() => {
        res.status(200).json({ message: "User updated successfully" });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Error updating user", error: err.message });
      });
  }
);

//-- [DELETE]
// User Delete
router.delete(
  "/:id",
  [checkIfExists.users(User), restrictAccess],
  (req, res) => {
    const { id } = req.params;

    User.deleteUser(id)
      .then((test) => {
        res
          .status(200)
          .json({ message: "User has been deleted successfully!", test: test });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Error deleting user", error: err.message });
      });
  }
);

//* Function to create the signature for the token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1h",
  };

  const secret = secrets.jwtSecret;

  return jwt.sign(payload, secret, options);
}

//* Export Router
module.exports = router;
