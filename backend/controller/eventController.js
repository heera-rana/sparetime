const asyncHandler = require('express-async-handler')
const { ObjectId } = require('mongodb')
const mongoose = require("mongoose")
const Event = require('../models/eventModels')


//pulls through all the current event data uses - http://localhost:5000/api/events
const allEvents =  asyncHandler(async (req, res) => {
    const allEvents = await Event.find({})
    res.status(201)
    res.send(allEvents)
}) 

//find one event
const oneEvent = asyncHandler(async(req, res)=>{
    let id = req.params.id
    const o_id = new ObjectId(id)
    const oneEvent = await Event.findOne({_id: `${o_id}`})
    res.status(201)
    res.send(oneEvent)
})

//delete one event
const deleteEvent = asyncHandler(async(req, res)=>{ 
    let id = req.params.id
    const o_id = new ObjectId(id)
    const deleteEvent = await Event.deleteOne({_id: `${o_id}`})
    res.status(201)
    res.send(deleteEvent)
})

//update event
const updateEvent = asyncHandler(async(req,res)=>{
    let myEvent = req.body
    const o_id = new ObjectId(req.body.id)
    const updateEvent = await Event.updateOne(
        {_id: `${o_id}`},
        {
            $set: {
              title: myEvent.title,
              ctegories: myEvent.categories,
              provider: myEvent.provider,
              date: myEvent.date,
              duration: myEvent.duration,
              price: myEvent.price,
              description: myEvent.description,
              availability: myEvent.availability,
            },
          },
    )
    res.status(201)
    res.send(updateEvent)
})

//add a new event
// using the route /api/users
const newEvent =  asyncHandler(async (req, res) => {
    const {title, categories, provider, date, duration, price, description, availability } = req.body

    //form validation this is too ensure all data is forms are filled out
    if(!title || !categories || !provider || !date || !duration || !price || !description || !availability) {
        res.status(400)
        throw new Error ('Please include all of the fields')
    }
    //duplicate user check then returns error message if duplicated
    const eventExists = await Event.findOne({
        title: `${title}`,
        categories: `${categories}`,
        provide: `${provider}`,
        data: `${date}`,
        duration: `${duration}`,
        price: `${price}`,
        description: `${description}`,
        availability: `${availability}`
    })

    if (eventExists) {
        res.status(400)
        throw new Error('Event already exists')
    }

    //create an event
    const event = await Event.create({
        title,
        categories,
        provider,
        date,
        duration,
        price,
        description,
        availability,
    })

    //this comes from the user above and then sends the data back into the database
    if (event) {
        res.status(201).json({
            _id: event._id,
            title: event.title,
            categories: event.categories,
            provider: event.provider,
            date: event.date,  
            price: event.price,
            description: event.description,
            availability: event.availability
        }) 
    }   else {
            res.status(400)
            throw new error('Invalid event data')
        }
})




module.exports = {
    newEvent,
    allEvents,
    oneEvent,
    deleteEvent,
    updateEvent
}