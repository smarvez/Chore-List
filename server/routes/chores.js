const express = require('express');
const router = express.Router();
const knex = require('../knex');

//this router is mounted at http://localhost:3000/chores
router.get('/', function(req, res, next) {
  knex('chores')
    .select()
    .then(chores => {
      res.send(chores);
    })
    .catch(err => {
      res.status(404).send(err);
    })
});

router.get('/:id', function(req, res, next) {
  knex('chores')
    .select()
    .where("id", req.params.id)
    .first()
    .then(chore => {
      res.send(chore);
    })
    .catch(err => {
      res.status(404).send(err);
    })
})

const validChore = (chore) => {
  return typeof chore.title == 'string' && 
    chore.title.trim() != '' &&
    chore.priority != 'undefined' &&
    !isNaN(Number(chore.priority));
}

router.post('/', (req, res, next) => {
  console.log(req.body);
  if(validChore) {
    const chore = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority
    };
    knex('chores')
      .insert(chore, 'id')
      .then(chores=> {
        res.send(chores)
      })
  } else {
    res.status(500).send(err)
  }
})

router.put('/:id', (req, res, next) => {
  console.log(req.body);
  if(validChore) {
    const chore = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority
    };
    knex('chores')
      .where('id', req.params.id)
      .update(chore, 'id')
      .then(chores => {
        res.send(chores)
      })
    } else {
      res.status(500).send(err)
    }
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  if (typeof id != 'undefined') {
    knex('chores')
      .where('id', id)
      .del()
      .then(result => {
        res.send(result[0])
      })
  } else {
    //respond with an error
    res.status(500).send(err)
  }
})

module.exports = router;
