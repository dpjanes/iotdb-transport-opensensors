/*
 *  make.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-08-10
 */

const iotdb = require('iotdb');
const _ = iotdb._;

const index = require("..")
const cfgd = require("./opensensors.json");

const mqtt_client = index.connect(cfgd, error => {
    if (error) {
        console.log("#", "error connecting", _.error.message(error));
        process.exit(1);
    }
})

const transport = index.make(cfgd, mqtt_client);

exports.transport = transport;
