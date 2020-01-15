var fs = require('fs');
var router = {
    checkRoute : function(url, req, res){
      switch(url){
        case "/":
        fs.readFile('../TutoGO.html', function(err, data){  
          if(err){
            console.log(err); 
          }
          res.end(data); 
        }); 
        break;
        case "/src/pixi.min.js":
        fs.readFile('../src/pixi.min.js', function(err, data){  
          if(err){
            console.log(err); 
          }
          res.end(data); 
        }); 
        break;
        case "/TutoGO.css":
            fs.readFile('../TutoGO.css', function(err, data){  
                if(err){
                  console.log(err); 
                }
                res.end(data); 
              }); 
              break;
        default:
        res.writeHead(404); 
        res.end("I'm not sure what you're looking for.");
        }
    }
}
module.exports = router;