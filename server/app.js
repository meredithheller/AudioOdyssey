const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'db8.cse.nd.edu',
  user: 'mheller5',
  password: 'audioodyssey',
  database: 'mmheller5'
})
connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
    if(err) throw err
    console.log(rows)
})
connection.end
/*
app.get("/", (req, res) => {
    // handle root
})

app.use(express.urlencoded({ extended: true }));

app.get('/members', (req,res) => {
    console.log(req)
    res.send('Hello World')
})

app.listen(port, () => {
    console.log('Example app listening on port')
})

app.use(router);

sequelize.sync(); 

app.listen(5000); */

