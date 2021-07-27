//* Import DB config
const { andWhere } = require('../../data/db-config')
const db = require('../../data/db-config')

//* Function to get all classes
function getAll() {
  return db('classes as c')
    .innerJoin('instructors_classes as ic', 'ic.classes_id', 'c.id')
    .innerJoin('users as u', 'ic.user_id', 'u.id')
    .select('c.*', 'u.name as instructor', 'ic.user_id')
}

//* Function to get all attendees
function getAttendees(id) {
  return db('classes as c')
    .where('c.id', id)
    .innerJoin('attendees as at', 'at.classes_id', 'c.id')
    .innerJoin('users as u', 'at.user_id', 'u.id')
    .select(
      'c.id as class_id',
      'c.name as class_name',
      'u.id as user_id',
      'u.name as attendee_name',
      'u.email',
      'u.username'
    )
}

//* Function to get the total amount of attendees of a class
function getAttendeesNum(id) {
  return db('classes as c')
    .where('c.id', id)
    .innerJoin('attendees as at', 'at.classes_id', 'c.id')
    .count('at.user_id as attendees_amount')
}

//* Function to register attendee
function registerAttendee(attendee) {
  return db('attendees').insert(attendee)
}

//* Function to remove attendee
function removeAttendee(attendee, classId) {
  return db('attendees as a')
    .where('a.classes_id', classId)
    .andWhere('a.user_id', attendee)
    .del()
}

//* Function to get class by [parameter]
function getClassBy(parameter, value) {
  return db('classes as c')
    .where({ [`c.${parameter}`]: value })
    .first()
    .innerJoin('instructors_classes as ic', 'ic.classes_id', 'c.id')
    .innerJoin('users as u', 'ic.user_id', 'u.id')
    .select('c.*', 'u.name as instructor', 'ic.user_id')
}

//* Function to create a new class
function createClass(classObj) {
  const newClass = {
    name: classObj.name,
    type: classObj.type,
    date_time: classObj.date_time,
    duration: classObj.duration,
    intensity: classObj.intensity,
    location: classObj.location,
    max_size: classObj.max_size,
  }

  return db('classes')
    .insert(newClass)
    .then((id) => {
      return db('instructors_classes').insert({
        classes_id: id,
        user_id: classObj.instructor_id,
      })
    })
}

//* Function to delete a class
function deleteClass(id) {
  return db('classes').where({ id }).del()
}

//* Function to update a class
function updateClass(changes, id) {
  const updatedClass = {
    name: changes.name,
    type: changes.type,
    date_time: changes.date_time,
    duration: changes.duration,
    intensity: changes.intensity,
    location: changes.location,
    max_size: changes.max_size,
  }

  return db('classes').where({ id }).update(updatedClass)
}

//* Export functions
module.exports = {
  getAll,
  getClassBy,
  createClass,
  deleteClass,
  updateClass,
  getAttendees,
  getAttendeesNum,
  registerAttendee,
  removeAttendee,
}
