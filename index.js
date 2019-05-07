const express = require('express');
const helmet = require('helmet');
const server = express();



const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  },
  debug: true,
};

//teaches knex how to find our dataBase
const db = knex(knexConfig);

server.use(express.json());
server.use(helmet());

// error.message
// when you do everything in index write the exact path
// if using a router do it differently ----

// endpoints here
server.get('/api/zoos', (req, res) => {
  db('zoos') //returns a promise that resolves to all records in the tables 
    // [then and catch] are the bros to get to the actual data 
    .then(zoos => {
      res.status(200).json(zoos); // if there were no errors this happens 
    })
    .catch(error => {
      res.status(500).json(error);
    })
  res.send('get');
})


// get id 
server.get('/api/zoos/:id', (req, res) => {
  const { id } = req.params;
  db('roles')
    .where({ id })
    .first()
    .then(zoo => {
      res.status(200).json(zoo)
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// put

server.put('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count)
      } else {
        res.status(404).json({ message: 'Animal not found' })
      }
    })
    .catch(err => {
      res.status(500).json(err)
    });
});


//delete

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).end();
      } else {
        res.status(404).json({ message: 'Animal not found' })
      }
    })
    .catch(err => {
      res.status(500).json(err)
    });
})


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});



// server.get('/api/zoos'), (req, res) => {
//     res.send('get zoos');
// }

// server.get('/api/zoos/:id'), (req, res) => {
//     res.send('get zoos');
// }

// server.delete('/api/zoos/:id'), (req, res) => {
//     res.send('get zoos');
// }

// server.put('/api/zoos/:id'), (req, res) => {
//     res.send('get zoos');
// }