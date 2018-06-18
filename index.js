// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config()

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
          console.log("found")
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
              to: 'oualidqannouf@gmail.com',
              from: 'test@example.com',
              subject: 'Nouveaux rendez-vous à Metz',
              text: 'Nouveaux rendez-vous à Metz! GO GO GO GO',
              html: '<strong>Nouveaux rendez-vous à Metz! GO GO GO GO</strong>',
            };
            sgMail.send(msg);
        }
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}



setInterval(PostCode, 10000);