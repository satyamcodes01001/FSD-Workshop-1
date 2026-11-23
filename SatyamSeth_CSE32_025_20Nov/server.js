const express = require('express');
const app = express();

app.use(express.json());

// Initial Data
let registrations = [
    {
        id: 501,
        participantName: "Riya Sharma",
        eventName: "Tech Fest",
        department: "CSE",
        ticketCount: 2,
        paymentStatus: "Paid"
    },
    {
        id: 502,
        participantName: "Arjun Mehta",
        eventName: "Code Sprint",
        department: "IT",
        ticketCount: 3,
        paymentStatus: "Pending"
    },
    {
        id: 503,
        participantName: "Neha Verma",
        eventName: "Tech Fest",
        department: "ECE",
        ticketCount: 1,
        paymentStatus: "Paid"
    }
];

let nextId = 504;

// Validation Function
function validateRegistration(data) {
    return data &&
        typeof data.participantName === "string" &&
        data.participantName.trim() !== "" &&
        typeof data.eventName === "string" &&
        data.eventName.trim() !== "" &&
        typeof data.department === "string" &&
        data.department.trim() !== "" &&
        Number.isInteger(data.ticketCount) &&
        data.ticketCount > 0 &&
        ["Paid", "Pending"].includes(data.paymentStatus);
}

// 1. GET All Registrations
app.get('/api/registrations', (req, res) => {
    res.status(200).json(registrations);
});

// 2. POST New Registration
app.post('/api/registrations', (req, res) => {

    if (!validateRegistration(req.body)) {
        return res.status(400).json({
            message: "Invalid request body"
        });
    }

    const newRegistration = {
        id: nextId++,
        participantName: req.body.participantName,
        eventName: req.body.eventName,
        department: req.body.department,
        ticketCount: req.body.ticketCount,
        paymentStatus: req.body.paymentStatus
    };

    registrations.push(newRegistration);

    res.status(201).json(newRegistration);
});

// 3. FILTER By Department
app.get('/api/registrations/filter', (req, res) => {

    const department = req.query.department;

    if (!department) {
        return res.status(400).json({
            message: "Department is required"
        });
    }

    const result = registrations.filter(
        r => r.department.toLowerCase() === department.toLowerCase()
    );

    res.status(200).json(result);
});

// 4. GET Pending Registrations
app.get('/api/registrations/pending', (req, res) => {

    const result = registrations.filter(
        r => r.paymentStatus === "Pending"
    );

    res.status(200).json(result);
});

// 5. GET Registration By ID
app.get('/api/registrations/:id', (req, res) => {

    const id = Number(req.params.id);

    const result = registrations.find(r => r.id === id);

    if (!result) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    res.status(200).json(result);
});

// 6. PUT Update Registration
app.put('/api/registrations/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    if (!validateRegistration(req.body)) {
        return res.status(400).json({
            message: "Invalid request body"
        });
    }

    registrations[index] = {
        id: id,
        participantName: req.body.participantName,
        eventName: req.body.eventName,
        department: req.body.department,
        ticketCount: req.body.ticketCount,
        paymentStatus: req.body.paymentStatus
    };

    res.status(200).json(registrations[index]);
});

// 7. DELETE Registration
app.delete('/api/registrations/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    registrations.splice(index, 1);

    res.status(200).json({
        message: "Registration deleted successfully"
    });
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});