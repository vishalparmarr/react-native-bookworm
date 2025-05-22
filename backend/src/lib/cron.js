//CRON JOBS
// CRON JOBS are scheduled tasks that run at specific intervals.
// we want to send 1 GET request to the server every 14 minutes

// How to define schedule ?
// You can define a schedule using a cron expression, which consists of five fields.

//! MINUTE, HOUR, DAY OF MONTH, MONTH, DAY OF WEEK

//? 0 0 * * * - At 00:00 (midnight) every day
//? 0 0 * * 1 - At 00:00 (midnight) every Monday
//? 0 0 * * 1-5 - At 00:00 (midnight) every weekday (Monday to Friday)

import cron from 'cron';
import http from 'http';

const job = new cron.CronJob('*/14 * * * *', function () {

    http.get(process.env.API_URL, (res) => {
        if (res.statusCode === 200) console.log("GET request sent successfully");
        else console.log("GET request failed ", res.statusCode);
    }).on('error', (err) => {
        console.error("Error sending GET request: ", err);
    });
});

export default job;


