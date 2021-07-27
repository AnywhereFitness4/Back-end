//* This middleware will be used to ensure that there is no empty data when creating a class

// Check class body
const mainBody = (req, res, next) => {
  const classData = req.body;

  if (
    !classData.name ||
    !classData.type ||
    !classData.date_time ||
    !classData.duration ||
    !classData.location ||
    !classData.max_size ||
    !classData.instructor_id
  ) {
    res.status(400).json({
      message:
        "Please make sure to include name, type, date/time, duration, location, instructor ID, and max class size",
    });
  } else {
    next();
  }
};

// Check attendee body
const attendeeBody = (req, res, next) => {
  const attendeeData = req.body;

  if (!attendeeData || !attendeeData.user_id) {
    res.status(400).json("Please specify a user id");
  } else {
    next();
  }
};

module.exports = {
  mainBody,
  attendeeBody,
};
