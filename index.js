// We need this to build our post string
require('dotenv').config()
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
var express = require('express');
var app = express();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;

const client = require('twilio')(accountSid, authToken);

var previousChunk = "";


function PostCode() {

  console.log("executed");

  // Build the post string from an object
  var post_data = querystring.stringify({
    callCount:1,
    page:'/eAppointment57/element/jsp/appointment.jsp',
    httpSessionId:'FB348C9822ECEB24FD15CCD7C963E434',
    scriptSessionId:'E76A9D53A308B223AAA6361F39CA1F31922',
    'c0-scriptName':'AjaxSelectionFormFeeder',
    'c0-methodName':'getClosedDaysList',
    'c0-id':0,
    'c0-param0':'boolean:false',
    'c0-param1':'string:1',
    'c0-param2':'string:27',
    'batchId':0
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'rdv.moselle.gouv.fr',
      port: '80',
      path: '/eAppointment57/dwr/call/plaincall/AjaxSelectionFormFeeder.getClosedDaysList.dwr',
      method: 'POST',
      headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        if(chunk.indexOf('2018') > 0)
        {
            if(previousChunk.length < chunk.length){
                previousChunk = chunk;
                console.log("Appointment found")
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                  to: 'oualidqannouf@gmail.com',
                  from: 'wowlead@wowlead.com',
                  subject: 'Nouveaux rendez-vous à Metz',
                  text: 'Nouveaux rendez-vous à Metz! GO GO GO GO',
                  html: 'Des nouveaux rendez-vous à la préfecture de Metz sont disponible!  Consulter rdv.moselle.gouv.fr',
                };
                sgMail.send(msg);


                client.messages
                  .create({
                     body: 'Des nouveaux rendez-vous à la préfecture de Metz sont disponible! Consulter rdv.moselle.gouv.fr',
                     from: '+12267734512',
                     to: ''
                   })
                  .then(message => console.log(message.sid))
                  .done();
                client.messages
                  .create({
                     body: 'Hi Chorouk c est le robot de walid, Des nouveaux rendez-vous à la préfecture de Metz sont disponible! Consulter rdv.moselle.gouv.fr',
                     from: '+12267734512',
                     to: ''
                   })
                  .then(message => console.log(message.sid))
                  .done();
            }
            else if(previousChunk.length > chunk.length)
              previousChunk = chunk;

        }
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}

setInterval(PostCode, 10000);

app.get('/', (req, res) => res.send('Running!'))

var server = app.listen(process.env.PORT || 80, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
