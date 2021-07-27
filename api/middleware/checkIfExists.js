//* This Middleware helps to validate and check if a certain record exists in the database
const users = (usersModel) => (req, res, next) => {
  const { id } = req.params;

  usersModel
    .getUserBy("id", id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "User not found!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error while getting user", error: err.message });
    });
};

const classes = (classesModel) => (req, res, next) => {
  const { id } = req.params;

  classesModel
    .getClassBy("id", id)
    .then((classObj) => {
      if (classObj) {
        req.classObj = classObj;
        next();
      } else {
        res.status(404).json({ message: "Class not found!" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error while getting class", error: err.message });
    });
};

//* Export functions
module.exports = {
  users,
  classes,
};
