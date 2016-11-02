/*
 *  connect_test.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-02
 */

const iotdb = require("iotdb");
const _ = iotdb._;

const transport = require("..")

const mqtt_client = transport.connect(require("./opensensors.json"), error => {
    if (error) {
        console.log("#", "error connecting", _.error.message(error));
        process.exit(1);
    }

    console.log("+", "ok");

    const topic = "/users/dpjanes/testing/sensor1";
    const payload = _.timestamp.add({
        "on": false,
    });
    const message = JSON.stringify(payload);

    mqtt_client.publish(topic, message, {}, error => {
        if (_.is.Error(error)) {
            console.log("#", "error sending", _.error.message(error));
            process.exit(1);
        }

        console.log("+", "message sent", topic, payload);
        setTimeout(() => process.exit(0), 500);
    });
});
