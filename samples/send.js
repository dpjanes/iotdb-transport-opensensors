/*
 *  send.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-02
 *
 *  Demonstrate sending something
 *  Make sure to see README first
 */

const transporter = require("../transporter");
const _ = require("iotdb")._;

const testers = require("iotdb-transport").testers;

const transport = require("./make").transport;
setInterval(() => testers.put(transport), 2000);
