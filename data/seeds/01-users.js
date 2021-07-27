exports.seed = function (knex) {
  return knex("users").insert([
    {
      name: "Richard Rodriguez",
      username: "rmjuarez12",
      password: "$2a$10$QWORjr6Kq/L5G6SYNXV/yO5cxKU0IFCTqAPdfL6f.RaQUxuxYk4pS",
      email: "email@gmail.com",
      role: "client",
    },
    {
      name: "John Doe",
      username: "john12",
      password: "$2a$10$QWORjr6Kq/L5G6SYNXV/yO5cxKU0IFCTqAPdfL6f.RaQUxuxYk4pS",
      email: "email2@gmail.com",
      role: "client",
    },
    {
      name: "Juan Jose",
      username: "jose12",
      password: "$2a$10$QWORjr6Kq/L5G6SYNXV/yO5cxKU0IFCTqAPdfL6f.RaQUxuxYk4pS",
      email: "email3@gmail.com",
      role: "instructor",
    },
  ]);
};

//* NOTE: the password for all is "test1234"
