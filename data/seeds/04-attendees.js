exports.seed = function (knex) {
  return knex("attendees").insert([
    {
      user_id: 1,
      classes_id: 1,
    },
    {
      user_id: 1,
      classes_id: 2,
    },
    {
      user_id: 1,
      classes_id: 3,
    },
    {
      user_id: 2,
      classes_id: 2,
    },
  ]);
};
