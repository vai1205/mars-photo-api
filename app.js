//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var request = require('request');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//const apiData = [];
const photoApiRes=[], idApiRes =[];
var solApiRes, camApiRes, dateApiRes;
app.get("/", function(req, res) {
  res.render("index", {
    sol:solApiRes,
    camera:camApiRes,
    photo:photoApiRes,
    id: idApiRes,
    date: dateApiRes,
  });
});
app.post("/", function(req, res) {
  const sol = req.body.sol;
  const camera = req.body.camera;

  var options = {
    method: "GET",
    url: "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos",
    qs: {
      sol: sol,
      camera: camera,
      api_key: "DEMO_KEY"
    }
  };

  request(options, function(error, response, body) {
    if (!error) {
      const data = JSON.parse(body);
      if(!data.photos){
        const statusText = data.error.message;
        res.render("error", {
          statusText: statusText
        });
      }else{
        console.log(data);
        console.log(data.photos);
        if (data.photos.length === 0) {
          res.render("error", {
            statusText: "The result for details you entered is not provided by NASA! Please try again with some other data. "
          });
        } else {
          solApiRes = data.photos[0].sol;
          camApiRes = data.photos[0].camera.full_name;
          dateApiRes = data.photos[0].earth_date;
          for (var i=0; i<data.photos.length; i++){
            photoApiRes[i] = data.photos[i].img_src;
            idApiRes[i]= data.photos[i].id;
          }
          res.redirect("/");
        }
      }

    } else {
      const statusText = error.statusText;
      res.render("error", {
        statusText: statusText
      });
    }
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started at 3000");
});
