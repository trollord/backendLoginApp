const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

//cors policy
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mandar@165',
    database: 'loginapp'
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

// Endpoint to insert data into the Users table
app.post('/register', (req, res) => {
    console.log('Request received:', req.query);
    const { username, email, password } = req.query;

    if (!username || !email || !password) {
        return res.status(400).send('Missing username, email, or password');
    }

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).send('Error inserting data');
        }

        res.status(201).send(`User added with ID: ${result.insertId}`);
    });
});

// Endpoint to fetch all users from the Users table
app.post('/login', (req, res) => {
    const { username, password } = req.query;
    console.log('Request received:', req.query);

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).send('Error fetching data');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(results[0]);
    });

});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

