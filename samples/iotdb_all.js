/*
 *  iotdb_all.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-03
 *
 *  Demonstrating sending all IOTDB data to open sensors
 */

const iotdb = require("iotdb");
const _ = iotdb._;

const iotdb_transport_opensensors = require("..");
const iotdb_transport_iotdb = require("iotdb-transport-iotdb");

const cfgd = require("./opensensors.json");
cfgd.simple = false;    // send everything

// connect to some things
iotdb.use("homestar-wemo");
iotdb.connect("WeMoSocket");

// create an IOTDB transporter
const iotdb_transporter = iotdb_transport_iotdb.make();

// create an OpenSensors transporter
const mqtt_client = iotdb_transport_opensensors.connect(cfgd, error => {
    if (error) {
        console.log("#", "error connecting", _.error.message(error));
        process.exit(1);
    }
})
const opensensors_transporter = iotdb_transport_opensensors.make(cfgd, mqtt_client);

// send all data from IOTDB to OpenSensors
opensensors_transporter.monitor(iotdb_transporter);
