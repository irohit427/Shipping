const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shipping"); 
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connection succeeded.");
});

var Schema = mongoose.Schema;

var shippingSchema = new Schema({
    form_id: String,
    date: Date,
    vessel: String,
    group: String,
    type: String,
    country: String,
    port: String,
    insp: String,
    company_insp: String,
    insp_fn: String,
    insp_ln: String,
    master_fn: String,
    master_ln: String,
    cheng_fn: String,
    cheng_ln: String,
    choff_fn: String,
    choff_ln: String,
    ae_fn: String,
    ae_ln: String
});

var Shipping = mongoose.model('Shipping', shippingSchema);


app.get('/', (request, response) =>  response.render('form'));
app.post('/', (request, response) => {
    var data = new Shipping(request.body);
    data.save()
    .then(item => {
      response.render('form');
      console.log("item saved to database");
    })
    .catch(err => {
      response.send('unable to save to database');
      console.log("unable to save to database");
      console.log(err);
    });
});

app.get('/view-form', (request, response)=> response.render('Displaydata'));

app.post('/view-form', (request, response)=>{
  Shipping.find({ form_id: request.body.form_id}).then(form =>{
    console.log(form);
    response.setHeader("Content-Type", "text/html");
  response.render('data', {
      form_id:form[0].form_id,
      date:form[0].date,
      vessel:form[0].vessel,
      group:form[0].group,
      type: form[0].type,
      country: form[0].country,
      port: form[0].port,
      insp: form[0].insp,
      company_insp: form[0].company_insp,
      insp_fn: form[0].insp_fn,
      insp_ln: form[0].insp_ln,
      master_fn: form[0].master_fn,
      master_ln: form[0].master_ln,
      cheng_fn: form[0].cheng_fn,
      cheng_ln: form[0].cheng_ln,
      choff_fn: form[0].choff_fn,
      choff_ln: form[0].choff_ln,
      ae_fn: form[0].ae_fn,
      ae_ln: form[0].ae_ln
   });
  }).catch(err => {
    console.log("Search Error");
  });
});

app.get('/edit/:form_id', (request, response)=>{
  Shipping.find({form_id: request.params.form_id}).then(form =>{
    response.setHeader("Content-Type", "text/html");
    response.render('edit', {
      form_id:form[0].form_id,
      date:form[0].date,
      vessel:form[0].vessel,
      group:form[0].group,
      type: form[0].type,
      country: form[0].country,
      port: form[0].port,
      insp: form[0].insp,
      company_insp: form[0].company_insp,
      insp_fn: form[0].insp_fn,
      insp_ln: form[0].insp_ln,
      master_fn: form[0].master_fn,
      master_ln: form[0].master_ln,
      cheng_fn: form[0].cheng_fn,
      cheng_ln: form[0].cheng_ln,
      choff_fn: form[0].choff_fn,
      choff_ln: form[0].choff_ln,
      ae_fn: form[0].ae_fn,
      ae_ln: form[0].ae_ln
    });
  }).catch(err => {
    console.log("Load Error");
  });
});

app.post('/edit/:form_id',(request, response) => {
  var id = request.params.form_id;
  console.log(id);
  Shipping.findOneAndUpdate({form_id:id}, {$set: {vessel: request.body.vessel}}, {new:true}).then((docs)=>{
    if(docs) {
       response.send('Success');
    } else {
       response.send('No data');
    }
}).catch((err)=>{
   response.send('Error');
});
});

app.listen(3000, () => console.info('Application running on port 3000'));