const Joi = require("joi")
const { objectId } = require("./custom.validation")

const getBookingById = {
params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
}),
}

const getBookingsByUser = {
params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
}),
query: Joi.object().keys({
    status: Joi.string().valid("pending", "confirmed", "cancelled"),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
}),
}

const getBookingsByEmailOrPhone = {
query: Joi.object()
    .keys({
    email: Joi.string().email(),
    phone: Joi.string(),
    status: Joi.string().valid("pending", "confirmed", "cancelled"),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    })
    .min(1),
}

const createBooking = {
body: Joi.object().keys({
    teamName: Joi.string().required(),
    teamLeaderName: Joi.string().allow("").required(),
    contact: Joi.string().allow("").required(),
    fieldId: Joi.string().custom(objectId).required(),
    fieldName: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    price: Joi.number().required(),
    notes: Joi.string().allow(""),
    userId: Joi.string().custom(objectId).required(),
}),
}

const updateBooking = {
params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
}),
body: Joi.object()
    .keys({
    teamName: Joi.string(),
    teamLeaderName: Joi.string(),
    contact: Joi.string(),
    fieldId: Joi.string().custom(objectId),
    fieldName: Joi.string(),
    date: Joi.date(),
    time: Joi.string(),
    price: Joi.number(),
    notes: Joi.string(),
    status: Joi.string().valid("pending", "confirmed", "cancelled"),
    })
    .min(1),
}

const confirmBooking = {
params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
}),
}

const cancelBooking = {
params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
}),
body: Joi.object().keys({
    reason: Joi.string().required(),
}),
}

const deleteBooking = {
params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
}),
}

module.exports = {
getBookingById,
getBookingsByUser,
getBookingsByEmailOrPhone,
createBooking,
updateBooking,
confirmBooking,
cancelBooking,
deleteBooking,
}
