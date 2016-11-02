/*
 *  transporter.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-11-02
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const iotdb = require('iotdb');
const _ = iotdb._;

const assert = require("assert");

const iotdb_format = require("iotdb-format");
const iotdb_transport = require('iotdb-transport');
const errors = require('iotdb-errors');

const logger = iotdb.logger({
    name: 'iotdb-transport-opensensors',
    module: 'transporter',
});

const make = (initd, mqtt_client) => {
    const self = iotdb_transport.make();
    self.name = "iotdb-transport-opensensors";

    const _mqtt_client = mqtt_client;
    assert.ok(_mqtt_client);

    const _initd = _.d.compose.shallow(
        initd, {
            channel: iotdb_transport.channel,
            unchannel: iotdb_transport.unchannel,
            encode: s => s.replace(/[\/$%#.\]\[]/g, (c) => '%' + c.charCodeAt(0).toString(16)),
            decode: s => decodeURIComponent(s),
            unpack: (doc, d) => JSON.parse(doc.toString ? doc.toString() : doc),
            pack: d => JSON.stringify(d.value),
        },
        iotdb.keystore().get("/transports/iotdb-transport-opensensors/initd"), {
            prefix: "/users/{{ username }}/",
            username: null,
            password: null,
            client_id: null,
        }
    );

    assert.ok(_initd.username, "initd.username is required");
    assert.ok(_initd.password, "initd.password is required");
    assert.ok(_initd.client_id, "initd.client_id is required");

    _initd.prefix = iotdb_format.format(_initd.prefix, _initd);

    self.rx.put = (observer, d) => {
        _mqtt_client.ensure(error => {
            if (_.is.Error(error)) {
                return observer.onError(error);
            }

            const topic = _initd.channel(_initd, d);
            const message = _initd.pack(d);

            if (_initd.verbose) {
                logger.info({
                    d: d,
                    topic: topic,
                    message: message,
                    message_type: typeof message,
                }, "VERBOSE: sending message");
            }

            _mqtt_client.publish(topic, message, {
                retain: _initd.retain,
                qos: _initd.qos,
            }, error => {
                if (_.is.Error(error)) {
                    return observer.onError(error);
                }

                observer.onNext(_.d.clone.shallow(d));
                observer.onCompleted();
            });
        });
    };
    
    self.rx.list = (observer, d) => { throw new errors.NeverImplemented(); };
    self.rx.remove = (observer, d) => { throw new errors.NeverImplemented(); };
    self.rx.added = (observer, d) => { throw new errors.NeverImplemented(); };
    self.rx.get = (observer, d) => { throw new errors.NeverImplemented(); };
    self.rx.bands = (observer, d) => { throw new errors.NeverImplemented(); };
    self.rx.updated = (observer, d) => { throw new errors.NeverImplemented(); };

    return self;
};

/**
 *  API
 */
exports.make = make;
