//* Import express and setup router
const express = require('express')
const router = express.Router()

//* Import models
const Classes = require('./classes-model')

//* Import Middleware
const checkIfExists = require('../middleware/checkIfExists')
const checkDuplicateRecords = require('../middleware/checkDuplicateRecords')
const restrictAccess = require('../middleware/restrictAccess')
const validateClassBody = require('../middleware/validateClassBody')

//* Setup API Endpoints

//-- [POST]
// Create a new class
router.post('/', [validateClassBody.mainBody, restrictAccess], (req, res) => {
  const classObj = req.body

  Classes.createClass(classObj)
    .then(() => {
      res.status(201).json({ message: 'Class created successfully!' })
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: 'Error creating class', error: err.message })
    })
})

// Register a user as attendee
router.post(
  '/:id/attendees',
  [
    restrictAccess,
    checkIfExists.classes(Classes),
    validateClassBody.attendeeBody,
    checkDuplicateRecords.attendees(Classes),
  ],
  (req, res) => {
    const { id } = req.params

    const attendee = {
      user_id: req.body.user_id,
      classes_id: id,
    }

    Classes.registerAttendee(attendee)
      .then(() => {
        res.status(201).json({ message: 'Attendee has been registered' })
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: 'Error registering attendee', error: err })
      })
  }
)

//-- [GET]
// Get ALL classes
router.get('/', (req, res) => {
  Classes.getAll()
    .then((classes) => {
      res.status(200).json(classes)
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: 'Error getting classes', error: err.message })
    })
})

// Get class by ID
router.get('/:id', checkIfExists.classes(Classes), (req, res) => {
  const { classObj } = req

  res.status(200).json(classObj)
})

// Get the attendees from a specific class
router.get('/:id/attendees', checkIfExists.classes(Classes), (req, res) => {
  const { id } = req.params

  Classes.getAttendees(id)
    .then((attendees) => {
      res.status(200).json(attendees)
    })
    .catch((err) => {
      res.status(500).json(err.message)
    })
})

// Get attendee amount of a class
router.get('/:id/attendeesNum', (req, res) => {
  const { id } = req.params

  Classes.getAttendeesNum(id)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((err) => {
      res.status(500).json(err.message)
    })
})

//-- [PUT]
// Update/edit a class
router.put(
  '/:id',
  [restrictAccess, checkIfExists.classes(Classes), validateClassBody.mainBody],
  (req, res) => {
    const { id } = req.params
    const classObj = req.body

    Classes.updateClass(classObj, id)
      .then(() => {
        res
          .status(200)
          .json({ message: 'Class has been updated successfully' })
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: 'Error updating class', error: err.message })
      })
  }
)

//-- [DELETE]
// Delete a class
router.delete(
  '/:id',
  [restrictAccess, checkIfExists.classes(Classes)],
  (req, res) => {
    const { id } = req.params

    Classes.deleteClass(id)
      .then(() => {
        res.status(200).json({ message: 'Class successfully deleted!' })
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: 'Error deleting class', error: err.message })
      })
  }
)

// Remove an attendee from a class
router.delete(
  '/:id/attendees',
  [restrictAccess, checkIfExists.classes(Classes)],
  (req, res) => {
    const { user_id } = req.body
    const { id } = req.params

    Classes.removeAttendee(user_id, id)
      .then((response) => {
        if (response === 0) {
          res.status(404).json({
            message: 'Attendee/class not found!',
          })
        } else {
          res.status(200).json({
            message: 'Attendee removed successfully!',
          })
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: 'Error removing attendee', error: err.message })
      })
  }
)

//* Export router
module.exports = router
