
const express = require('express')
const app = express()
const comp = require('./helpers/compiler');
const compiler = require('./test/test.js');
var cors = require('cors')
const fs = require('fs');
const https = require('https');
const http = require('http');

var options = {
        key : fs.readFileSync('../keys/client-key.pem'),
        cert : fs.readFileSync('../keys/client-cert.pem')
}


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
app.use(cors());
app.options('*', cors());


app.listen(8080, () => {
    console.log('Serveur à l\'écoute')
    comp.test();
  });

app.post('',(req,resp) => {
    console.log(req.body);
    let contract = comp.formatContract(req.body);
   /* fs.writeFile('res.sol',contract , function (err) {
      if (err) throw err;
      console.log('Saved!');
    }); */
    if (!contract){
      resp.status(200).json({'failed':true})
    }else{
      let obj = compiler.compile_contract(contract,req.body.name.replace(' ',''));
      resp.status(200).json(obj)
    }
    
})


app.get('',(req,resp) => {
  let body = JSON.parse(req.params.data);
  console.log(body);
  let contract = comp.formatContract(body);
  /* fs.writeFile('res.sol',contract , function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); */
  if (!contract){
    resp.status(200).json({'failed':true})
  }else{
    let obj = compiler.compile_contract(contract,body.name.replace(' ',''));
    resp.status(200).json(obj)
  }
  
})



// Create an HTTP service.
http.createServer(app).listen(8008);
// // Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);

