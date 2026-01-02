const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'employees.json');

// Ensure data folder and file exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');

// Read JSON safely
function readEmployees() {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Write JSON
function writeEmployees(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Add employee
app.post('/employees', (req, res) => {
    const employees = readEmployees();
    const { name, age, department, salary } = req.body;

    if (!name || !age || !department || !salary)
        return res.status(400).json({ message: 'All fields required' });

    const newEmployee = {
        id: employees.length ? employees[employees.length - 1].id + 1 : 1,
        name, age, department, salary
    };

    employees.push(newEmployee);
    writeEmployees(employees);
    res.json(newEmployee);
});

// Get all employees
app.get('/employees', (req, res) => res.json(readEmployees()));

app.listen(PORT, () => console.log(Server running at http://localhost:${PORT}));
