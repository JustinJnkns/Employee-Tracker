const sqlite3 = require('sqlite3').verbose()
const express = require('express')
const PORT = process.env.PORT || 3001;
const app = express();

  // Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
// connects to database
const db = new sqlite3.Database('./db/employees.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the employee database.');
});

// Get single employee
app.get('/api/employee/:id', (req, res) => {
  const sql = `SELECT * FROM employee 
               WHERE id = ?`;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: row
    });
  });
})

// Get all employees
app.get('/api/employee', (req, res) => {
  const sql = `SELECT * FROM employee`;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: rows
    });
  });
})

// Delete a employee
app.delete('/api/employee/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({
      message: 'successfully deleted',
      changes: this.changes
    });
  });
})
// Create a employee
const sql = `INSERT INTO employee (id, first_name, last_name, manager_id) 
              VALUES (?,?,?,?)`;
const params = [4, 'John', 'Firbank', 1];
// ES5 function, not arrow function, to use this
db.run(sql, params, function(err, result) {
  if (err) {
    console.log(err);
  }
  console.log(result, this.lastID);
})
// Default response for any other requests(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
