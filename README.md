# iotdb-transport-opensensors
[IOTDB](https://github.com/dpjanes/node-iotdb) 
[Transporter](https://github.com/dpjanes/node-iotdb/blob/master/docs/transporters.md)
for
[OpenSensors.io](https://www.opensensors.io/)

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# About

This Transporter will send all your sensor data to OpenSensors.io.

* [Read more about Transporters](https://github.com/dpjanes/node-iotdb/blob/master/docs/transporters.md)
* [OpenSensors.io](https://www.opensensors.io/)

# Use

See the samples folder for working examples.
This example will only the `istate` (the actual data from sensors)
to OpenSensors.
If you want to send all the bands, set `simple` to `false`

    const iotdb = require("iotdb");
    const _ = iotdb._;

    const iotdb_transport_opensensors = require("iotdb-transport-opensensors");
    const iotdb_transport_iotdb = require("iotdb-transport-iotdb");

    const cfgd = {
        "simple": true,         // this is the default, false will send everything
        "username": "username", // assigned by OpenSensors.io
        "password": "password", // assigned by OpenSensors.io
        "client_id": "9999",    // assigned by OpenSensors.io
    }

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

    // send data from IOTDB to OpenSensors
    opensensors_transporter.monitor(iotdb_transporter);

Note that you don't have to necessarily set up `cfgd` in your code.
You can also use the keystore

    $ homestar set /transports/iotdb-transport-opensensors/initd/username "username"
    $ homestar set /transports/iotdb-transport-opensensors/initd/password "password"
    $ homestar set /transports/iotdb-transport-opensensors/initd/client_id "client_id"
