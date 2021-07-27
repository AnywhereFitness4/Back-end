exports.seed = function (knex) {
  return knex("instructors_classes").insert([
    {
      user_id: 3,
      classes_id: 1,
    },
    {
      user_id: 3,
      classes_id: 2,
    },
    {
      user_id: 3,
      classes_id: 3,
    },
  ]);
};
