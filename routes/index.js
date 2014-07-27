var ErrorHandler = require('./error').errorHandler;
var ObjectID = require('mongodb').ObjectID;

module.exports = exports = function(app, db) {

  /* REST API
    url           HTTP Method   Operation
    /items        GET           Get all todo items
    /items/:id    GET           Get item with id of :id
    /items        POST          Add new item, return item with id attribute added
    /items/:id    PUT           Update item with id of :id
    /items/:id    DELETE        Delete item with id of :id
  */

  // Home page
  app.get('/', function(req, res) {
    res.redirect('/index.html');
  });

  app.get('/items', function(req, res) {

    db.collection('items').find({}).toArray(function(err, results) {
      if (err) return next(err);
      console.log('get all todos ->', results);
      res.json(results);
    });

  });

  app.get('/items/:id', function(req, res) {
    var id = req.params.id, oid;

    console.log('id -> ', id);
    oid = new ObjectID.createFromHexString(id);

    db.collection('items').findOne({_id:oid}, function(err, results) {
      if (err) return next(err);
      console.log('get todo ->', results);
      res.json(results);
    });

  });


  app.post('/items', function(req, res) {
    var item = req.body;
    console.log('item ->', item, JSON.stringify(item));

    db.collection('items').save(item, function(err, result) {
      if (err) return next(err);
      console.log('save todo ->', result);
      res.json(result);
    })
  });

  app.put('/items/:id', function(req, res) {
    var item = req.body, id = req.params.id, oid;

    console.log('item ->', item, 'id ->', id);
    oid = new ObjectID.createFromHexString(id);
    item._id = oid;

    db.collection('items').save(item, function(err, result) {
      if (err) return next(err);
      console.log('updated %d todo item', result);

      // We could do a findOne() to retrieve updated document and return
      // it to client but here we'll copy back the one received from
      // client.
      item._id = id;
      res.json(item);
    })
  });

  app.delete('/items/:id', function(req, res) {
    var item = req.body, id = req.params.id, oid;

    console.log('item ->', item, 'id ->', id);
    oid = new ObjectID.createFromHexString(id);
    item._id = oid;

    db.collection('items').remove({_id:oid}, function(err, result) {
      if (err) return next(err);
      console.log('removed %d todo item', result);

      item._id = id;
      res.json(item);
    })
  });

  // Error handling middle-ware
  app.use(ErrorHandler);
};