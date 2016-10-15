// @flow
var express = require('express');
var router = express.Router();

const title = 'Le ballon rouge';
const tops = [
  'Entrée public',
  'Balançoire',
  'Carrefour',
  'Prise en main du ballon',
  'Première ville',
  'Le garçon relâche le ballon',
  'Fenêtres',
  'Assis sur le ballon',
  'Il perd son ballon',
  'Traversée magique du ballon',
  'Deuxième ville',
  'Il fout le bordel dans l\'immeuble',
  'Fin du bordel',
  'Son ami la lampe le sauve',
  'La lampe se transforme en pont'
];
const state = {
  top: 0
};

var render = function(res) {
  res.render('index', {
    title: title,
    now: state.top,
    next: state.top + 1,
    nowText: tops[state.top],
    nextText: tops[state.top + 1]
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  render(res);
});

router.post('/', function(req, res) {
  var top = 0;
  if (req.body.top !== null) {
    top = parseInt(req.body.top);
  }
  state.top = top;
  render(res);
});

module.exports = router;
