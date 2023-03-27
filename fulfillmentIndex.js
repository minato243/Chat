'use strict';

// Import the Dialogflow module from Google client libraries.
const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

// Enter your calendar ID below and service account JSON below
const calendarId = "3578155bd6a28e5df6ad78ceec07e734d4766380c1f8494c6234f071e7776cf1@group.calendar.google.com";
const serviceAccount = {"type": "service_account",
  "project_id": "appointmentscheduler-valr",
  "private_key_id": "36fcb2c09e2b29efc110ff381a19d265ab68f9d9",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEmhHFtUApiNSQ\nq4lUVXjoXJSMIhBgbWrr9wtWH5rlrPi8XQ8vRMYOQJKC/Nu8g1liCCstI2FF/QvN\n7xePAEhqLVdSQslNyipvHqxeSkW7e5t+SxjYym30DHRy0PqLiezIeDHSsJD4zBDt\ngF0DVRUfiy13KGhW4eOdN8fhGdNBMkDQTLh+SvWdCYxoLyevW8IZR9n55Zq2fGQW\njzPz1uw/jX27oqamCElRDb1zsVN3sOQs0wgfKKKywkpdDnreGIoBkaHzqC3KxpS+\nz9up2Ylj5aSIpRwEZaszIfLnAvUB1I+3111ZiG2xU9AA6TvXYnAA9GIjsPbOObCE\n9QWoyEJVAgMBAAECggEADq/CvZ37X87usCr8TI5BBLyrxScjSYzK9Lsk/+dHAzrP\nbwTVpk6RLA3jVAEvKg823WWmUg4nTVrop5bhj+dxwWrHL+g40QSV9GyabEXInUeP\n11ilT8aZfaZziYM2gDeKtnQSJr7VaZyW9CMHb8EKnatgN1tPphPkVMGOvzBWcXN9\nqlHVNOqoV+QmdH33pb4TuDEcC//cemfcLs1YFn7vjrB/abrI7729LwCD6gsGKUeu\nVorf+CnHPhhXi4zz/u72utmsQsDeZ8ji6wDiMzQwihmAea3hyKHYbXJ98r0Ylx2D\nNj1V4o+lVGD/ZimrwY4tz1m14j6yftk/YLdEWMvOIQKBgQD3ODrCpm2mIu8aFDwC\nxGJynsltRb+qUwLSUXKg21fGHGI8kd9O9ZvWnA2tcHbdjO29N4Imv8JcEEcgRkdM\njTIZuEBqHtWQP52ZT1KtVn8e666gAb+piqxIV0/ufKlxzNesE62+ghDod1SXpvIC\nxIy7e2RGNs/QMKEQ9sl/F/f7YQKBgQDLlZzUKxduOJjXFXQzy+ov/6+hXgtFrE+C\npkxVnFhmLF6Bt3WUB96xcVbeZjDeJEoy2w4a5yvYs3iU78heO57A0rcI04WSC3cR\nKvkVzAFxwxROXUfb/xjGBmAzLU/BmraRYCFnhiQOzQh5WldWL/oX2HR5eZND1+0j\nfE4qJwW/dQKBgQDQJK2EeS9Uc5EwOd0Uz1e7/WjF8bWfp+h2P1Dtkf9isz8alA6Z\nojylAhqZ7liFzEPVzchs64KulJ3t1H3vO+n0saa6Ml/I5WbBT4HiozLAS9poqVA/\nZJwNBEYuGxNm1vq2zJK6FTQ7JU05qbuVDPsYVplkbH2nYWoaqE2aDgohwQKBgEnX\no4HFe4MsHivtiS98aB4u1KpoLRiBbnmKDigDRIES2NieDZS64ghkfsi+Mj1w1kTp\n9YzGir3YIwWKj5e2cleoVmFqL4mQhQiCGMTSMTftNUFTTkw6k+bHyz7k0Yf8sPm7\n74HYQt3neophvUnyrvjVNzIUadjyyf3UCZn6e3g9AoGAY/m+NBgxUwwCEFJ6+P60\nNZ4GSytQ2ERqTJeeIihlYPfhej1k9GrSVk+Lylue4Q3HAphB5EeTpEVK2l/8fA8j\nLkxQNnbS55lh3weBLJr/rnyBj2jH/Sr5eeqDHmGpzWCVFoUJBwdwGFoNm4U3tlG9\n7q9dd3dWoYKYJ4Rd6CD2GSw=\n-----END PRIVATE KEY-----\n",
  "client_email": "appointment-schedule@appointmentscheduler-valr.iam.gserviceaccount.com",
  "client_id": "116996687388469777360",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/appointment-schedule%40appointmentscheduler-valr.iam.gserviceaccount.com"}; // Starts with {"type": "service_account",...

// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
 email: serviceAccount.client_email,
 key: serviceAccount.private_key,
 scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const timeZone = 'America/Los_Angeles';
const timeZoneOffset = '-07:00';

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
 const agent = new WebhookClient({ request, response });
 console.log("Parameters", agent.parameters);
 const appointment_type = agent.parameters.AppointmentType;
 function makeAppointment (agent) {
   // Calculate appointment start and end datetimes (end = +1hr from start)
    let dateStr = agent.parameters.date.split('T')[0];
    let timeStr = agent.parameters['date-time'].split('T')[1].split('-')[0];
    const dateTimeStart = new Date(Date.parse(dateStr + 'T' + timeStr + timeZoneOffset));
   const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
   const appointmentTimeString = dateTimeStart.toLocaleString(
     'en-US',
     { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
   );
    // Check the availability of the time, and make an appointment if there is time on the calendar
   return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
     agent.add(`Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!.`);
   }).catch(() => {
     agent.add(`I'm sorry, there are no slots available for ${appointmentTimeString}.`);
   });
 }

// Handle the Dialogflow intent named 'Schedule Appointment'.
 let intentMap = new Map();
 intentMap.set('Schedule Appointment', makeAppointment);
 agent.handleRequest(intentMap);
});

//Creates calendar event in Google Calendar
function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
 return new Promise((resolve, reject) => {
    console.log("createCalendarEvent");
   calendar.events.list({
     auth: serviceAccountAuth, // List events for time period
     calendarId: calendarId,
     timeMin: dateTimeStart.toISOString(),
     timeMax: dateTimeEnd.toISOString()
   }, (err, calendarResponse) => {
     // Check if there is a event already on the Calendar
     console.log("err" + err);
     if (err || calendarResponse.data.items.length > 0) {
        console.log(err);
       reject(err || new Error('Requested time conflicts with another appointment'));
     } else {
       // Create event for the requested time period
       console.log("insert event");
       calendar.events.insert({ auth: serviceAccountAuth,
         calendarId: calendarId,
         resource: {summary: appointment_type +' Appointment', description: appointment_type,
           start: {dateTime: dateTimeStart},
           end: {dateTime: dateTimeEnd}}
       }, (err, event) => {
         err ? reject(err) : resolve(event);
       }
       );
     }
   });
 });
}