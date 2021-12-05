const express = require('express')
const app = express()
const comp = require('./helpers/compiler');


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());


app.listen(8080, () => {
    console.log('Serveur à l\'écoute')
    comp.test();
  });

app.post('',(req,resp) => {
    comp.handleBody(req.body);
    resp.status(200).json({'status':'success'})
})





