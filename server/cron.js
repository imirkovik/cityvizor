var CronJob = require('cron').CronJob;

var mongoose = require('mongoose');

var config = require("./config/config");

var job = new CronJob({
  cronTime: config.cron.time,//'00 00 01 * * *',
  onTick: function() {

    console.log("##### MIDNIGHT CRON RUN #####");

    try {
      // connect DB
      let dbdisconnect = false;

      // wait for DB. 2 = connecting, 3 = disconnecting
      while(mongoose.connection.readyState === 2 || mongoose.connection.readyState === 3){}

      // if not connected, connect
      if(mongoose.connection.readyState !== 1){

        dbdisconnect  = false;

        mongoose.Promise = global.Promise;
        mongoose.plugin(require('mongoose-write-stream'));
        mongoose.plugin(require('mongoose-paginate'));
        mongoose.connect('mongodb://localhost/' + config.database.db);
        console.log("DB connecting...");
      }
      else console.log("DB connected already");


      // set the tasks
      var tasks = [];

      tasks.push(require("./tasks/export-profiles-json"));
      tasks.push(require("./tasks/export-profiles-csv"));
      tasks.push(require("./tasks/export-budgets-json"));
      tasks.push(require("./tasks/export-budgets-csv"));
      tasks.push(require("./tasks/export-events-json"));
      tasks.push(require("./tasks/export-events-csv"));
      tasks.push(require("./tasks/download-contracts"));

      // loop through the tasks one by one
      runTaskLoop(tasks,() => {
        if(dbdisconnect){
          console.log("Disconnecting DB");
          mongoose.disconnect();
        }

        console.log("Finished!");
      });
    }
    catch(err) {
      console.log(err);
    }
  },
  start: true, /* Start the job right now */
  runOnInit: true,
  timezone: 'Europe/Prague' /* Time zone of this job. */
});

function runTaskLoop(tasks,cb){
  let task = tasks.shift();

  if(!task) return cb();

  console.log("Starting task...");

  task(() => {
    console.log("===================================");
    console.log("Wait 2 sec");

    if(tasks.length) setTimeout(() => runTaskLoop(tasks,cb),2000);
    else cb();
  });
}