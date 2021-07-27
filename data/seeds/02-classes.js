exports.seed = function (knex) {
  return knex("classes").insert([
    {
      name: "Aerobics",
      type: "Physical",
      date_time: "Jul. 28, 2021 - 12:00PM",
      duration: "2hrs",
      intensity: "Hard",
      location: "Lake Charles",
      max_size: 20,
    },
    {
      name: "Yoga",
      type: "Physical",
      date_time: "Jul. 26, 2021 - 3:00PM",
      duration: "1hrs",
      intensity: "Med",
      location: "Nashville",
      max_size: 10,
    },
    {
      name: "Jogging",
      type: "Physical",
      date_time: "Jul. 23, 2021 - 5:00PM",
      duration: "1hrs",
      intensity: "Easy",
      location: "Nashville",
      max_size: 30,
    },
  ]);
};
