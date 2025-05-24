const { v4: uuidv4 } = require("uuid");

function getDefaultTimeSlots() {
  return [
    { id: uuidv4(), time: "8h-9h30", status: "available", price: 300000, bookedBy: null, note: null },
    { id: uuidv4(), time: "9h30-11h", status: "available", price: 300000, bookedBy: null, note: null },
    { id: uuidv4(), time: "11h-12h30", status: "available", price: 300000, bookedBy: null, note: null },
    { id: uuidv4(), time: "12h30-14h", status: "available", price: 300000, bookedBy: null, note: null },
    { id: uuidv4(), time: "14h-15h30", status: "available", price: 300000, bookedBy: null, note: null },
    { id: uuidv4(), time: "15h30-17h", status: "available", price: 300000, bookedBy: null, note: null },
    { id: uuidv4(), time: "17h-18h30", status: "available", price: 300000, bookedBy: null, note: null },
    { id: uuidv4(), time: "18h30-20h", status: "available", price: 300000, bookedBy: null, note: null },
  ];
}

module.exports = { getDefaultTimeSlots }; 