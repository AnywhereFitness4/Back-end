# Front End

This documentation is for reference to frontend developers.

## API Endpoints (Users)

- **NOTE:** For all endpoints below, the base URL is: 'https://anywhere-fitness-4u.herokuapp.com'

| Method | Endpoint              | Description                                                                                                                                                                                                                                                                   |
| ------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /users/register       | Creates a `user` using the information sent inside the `body` of the request. **NOTE:** Ensure to use only `client` or `instructor` on the role property.                                                                                                                     |
| POST   | /users/login          | Use the credentials sent inside the `body` to authenticate the user. On success, you will receive a response with a welcome message, user ID and, a token.                                                                                                                    |
| GET    | /users/:id            | **_You MUST send with an authorization header with the token!_** This endpoint is to get the data of a user. This is meant for frontend to be able to gather the data of the `logged in` user.                                                                                |
| GET    | /users/:id/instructor | This will get all classes from an instructor. If no classes are found, you will receive a message specifying no classes were found.                                                                                                                                           |
| GET    | /users/:id/attendee   | This will get all classes that a user has registered to. If no classes are found, you will receive a message specifying no classes were found.                                                                                                                                |
| PUT    | /users/:id            | **_You MUST send with an authorization header with the token!_** The main purpose for this endpoint is for users to be able to update any data from their profile. This could be name, email, password, etc. The `id` parameter **_SHOULD_** be the id of the logged in user. |
| DELETE | /users/:id            | **_You MUST send with an authorization header with the token!_** This endpoint is to delete a specific user. The `id` parameter **_SHOULD_** be the id of the logged in user.                                                                                                 |

### Request body structure

These are the expected objects for the endpoints above(this is mostly for the login/registration/update)

- [POST] `/users/register` - For the registration, use the sample object below as reference on what the endpoint is expecting to receive. Currently, all the fields below are **_REQUIRED_**

```js
{
	name: "Chaz Carbis",
	username: "uniqueName1234", // Must be unique. Will throw an error if it already exists
	password: "PaSsWoRd1234", // When creating, this must NOT be empty
	email: "email@gmail.com", // Must be unique. Will throw an error if it already exists
	role : "client" // For now, it MUST be either "client" or "instructor"
}
```

- [POST] `/users/login` - For the login, you simply need the 2 fields below.

```js
{
	username: "uniqueName1234",
	password: "PaSsWoRd1234"
}
```

- [PUT] `/users/:id` - This is to update the user data. Make sure to use the structure below. All fields are required, except for the password. If there is no password, we will just use the one that the user already created

```js
{
	name: "Chaz Carbis",
	username: "uniqueName1234", // Must be unique. Will throw an error if it already exists
	password: "PaSsWoRd5678", // This field is not required. If empty, we will use old password
	email: "email2@gmail.com", // Must be unique. Will throw an error if it already exists
	role : "instructor" // For now, it MUST be either "client" or "instructor"
}
```

### Notes

- I have setup measures in the backend to ensure we have no duplicates. Please check the responses you get from the API, as I have specified messages so you can debug if needed(i.e. if there is no username on login you will get a responser: "Please provide a username and password!").
- The token provided by the backend has a lifetime of 1hr. After 1hr, the user will need to login again to get a new token
- Please make sure to do proper validation to forms, to ensure the data we are receiving is the correct one and not the wrong one(i.e. for emails, ensure is a valid email).

## API Endpoints (Classes)

- **NOTE:** For all endpoints below, the base URL is: 'https://anywhere-fitness-4u.herokuapp.com'

| Method | Endpoint                  | Description                                                                                                                                                                                                                   |
| ------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /classes                  | **_You MUST send with an authorization header with the token!_** Creates a new `class` using the information sent inside the `body` of the request. **NOTE:** Ensure to use only `instructors` are able to use this endpoint. |
| POST   | /classes/:id/attendees    | **_You MUST send with an authorization header with the token!_** This endpoint registers a user to a `class`. User's role is irrelevant, any type of user can register.                                                       |
| GET    | /classes                  | This will return an array of ALL available `classes`. The results will also include the instructor's name in the response                                                                                                     |
| GET    | /classes/:id              | This will return an specific class from all the `classes`. If the ID supplied brings no results, it will return a 404 error.                                                                                                  |
| GET    | /classes/:id/attendees    | This will return an array of ALL attendees from a specific class.                                                                                                                                                             |
| GET    | /classes/:id/attendeesNum | This will return the total number of attendees from a specific class.                                                                                                                                                         |
| PUT    | /classes/:id              | **_You MUST send with an authorization header with the token!_** This endpoint is to edit a specific class. The user MUST be an `instructor`, and must be logged in before using this endpoint                                |
| DELETE | /classes/:id              | **_You MUST send with an authorization header with the token!_** This endpoint is to delete a specific class. The user MUST be an `instructor`, and must be logged in before using this endpoint                              |
| DELETE | /classes/:id/attendees    | **_You MUST send with an authorization header with the token!_** This endpoint just removes a user from the attendee list from a `class`                                                                                      |

### Request body structure

These are the expected objects for the endpoints above(This is mostly for creating/editing `classes`). Remember that the user MUST be logged in before doing anything. Otherwise, you will get an authentication error.

- [POST] `/classes` - The objext below is what is expected from the request body. Remember that you MUST make sure that the user has a `instructor` role. Currently, all the fields below are **_REQUIRED_**

```js
{
	name: "Jogging",
	type: "Physical", // This type can be anything. That is up to front end
	date_time: "Mar. 28, 2021 - 12:00PM", // Format can be different. This is just for reference
	duration: "1hrs",
	intensity: "Med",
	location: "Miami Gym",
	max_size: 40,
	instructor_id: 2 // This is the ID of the user posting the class
}
```

- [POST] `/classes/:id/attendees` - This will register a user to a certain class. The ID parameter in here is the class ID, and the only thing you need to pass is the User's ID:

```js
{
  user_id: 3;
}
```

- [PUT] `/classes/:id` - This is to update a class. The structure of the object is the same as the above one.

```js
{
	name: "Jazzercize",
	type: "Physical",
	date_time: "Jul. 28, 2021 - 12:00PM",
	duration: "2hrs",
	intensity: "High",
	location: "YMCA",
	max_size: 40,
	instructor_id: 2
}
```

- [DELETE] `/classes/:id/attendees` - This will remoce an attendee from a certain class. The ID parameter in here is the class ID, and the only thing you need to pass is the User's ID:

```js
{
  user_id: 3;
}
```

### Notes

- For anything that requires on entering data on database(such as creating new class, or updating it), ALWAYS ensure to send a token on the header. Otherwise, you will get an authentication error
- Creating classes and managing classes is meant to be only for instructors, so make sure only users with `instructor` roles can access such functions
- Any type of user will be able to register to attend. So `instructors` and `clients` will be able to register for a class.