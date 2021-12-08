const express = require('express')
const app = express()
const comp = require('./helpers/compiler');
const compiler = require('./test/test.js');
var cors = require('cors')
const fs = require('fs');


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
   /*  fs.writeFile('res.sol',contract , function (err) {
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




