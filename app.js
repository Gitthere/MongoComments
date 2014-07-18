
var restify = require('restify');
var mongoose = require('mongoose');
mongoose.connect('mongodb://mongocomments:mongocomments@ds027789.mongolab.com:27789/mongocomments');
//use mongoose schema
var Schema = mongoose.Schema;

//define the comment Schema
var commentSchema = new Schema ({
  comment_text: String
})

//define the comment model
var Comment = mongoose.model('Comment', commentSchema);

var server = restify.createServer({
  name: 'app',
  version: '0.0.0'
});



server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());



server.get('/test', function(req, res) {
  console.log('the test path was accessed');
  res.send('sent this back from server');
})


server.get('/', function(req,res) {
  var body = '';
  Comment.find(function(err, postedItems) {
    for(i in postedItems) {
      console.log(postedItems[i].comment_text);
      body += postedItems[i].comment_text + '<br>';
    }
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.send();
  });
});


server.post('/usercomment', function(req,res) {
  console.log('testing usercomment');
  console.log(req.body.message);
  var new_comment = new Comment({
    comment_text: req.body.message
  })

  new_comment.save(function(something_bad_happened) {
    if (something_bad_happened) {
      return res.send(err);
    }
    
    // nothing bad happened
    res.send("message was saved");

  });
});




server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});


// server.post("/post_comment", function(req,res) {
//   var new_comment = new Comment({
//     comment_text:req.body.comment
//   });

//   comment.save(err) {
//     if (err) return console.log(err);
//   }  

//   res.send(req.body.comment);
//   res.send(ok);

// })



// server.post('/output', function(req,res,next) {
//   console.log(req.body.filename, req.body.content);
//   fs.writeFile(req.body.filename, req.body.content, function (err) {
//     if (err) throw err;
//     console.log('It\'s saved!');
//   });

//   res.send(req.body.filename +' has been created.');

// });


