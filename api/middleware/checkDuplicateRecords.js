//* This Middleware is to ensure that there are no duplicate records when adding them to the DB
const users = (usersModel) => (req, res, next) => {
  const { username } = req.body;

  usersModel
    .getUserBy("username", username)
    .then((user) => {
      if (user) {
        res
          .status(403)
          .json({ message: "A user with that username already exists!" });
      } else {
        next();
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error while getting user", error: err.message });
    });
};

const classes = (classesModel) => (req, res, next) => {
  const classData = req.body;

  classesModel
    .getClassBy("id", classData.id)
    .then((classObj) => {
      if (classObj) {
        res
          .status(403)
          .json({ message: "A class with that id already exists!" });
      } else {
        next();
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error while getting class", error: err.message });
    });
};

const attendees = (classesModel) => (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.body;

  let duplicate;

  classesModel
    .getAttendees(id)
    .then((attendeesArr) => {
      attendeesArr.map((att) => {
        if (att.user_id === user_id) {
          res.status(403).json({ message: "Attendee CAN'T register twice" });
          duplicate = true;
        }
      });

      if (!duplicate) {
        next();
      }
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error while getting attendees", error: err.message });
    });
};

//* Export functions
module.exports = {
  users,
  classes,
  attendees,
};
