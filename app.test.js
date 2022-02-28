const request = require('supertest');
const app = require('./app')

describe('POST /users', function () {
    it('Success station validation', function (done) {
        request(app)
            .post('/update/updateweatherstation')
            .send({
                "ID": "test_station",
                "PASSWORD": "asdfgh",
                "data": [
                    {
                        "dateist": "2020-10-11 12:05:10.000000",
                        "dailyrainMM": "10",
                        "rain": [
                            "2020-12-11 12:05:10",
                            "2020-12-11 12:06:10",
                            "2020-12-11 12:07:10",
                            "2020-12-11 12:08:10"
                        ],
                        "tempc": 12.2,
                        "winddir": 12.5,
                        "windspeedkmh": 40,
                        "humidity": 16,
                        "baromMM": 10.0
                    }
                ],
                "health": {
                    "BAT": 12.2,
                    "network": "GSM",
                    "RSSI": 12.1
                },
                "action": "update",
                "softwareType": "Leecom",
                "version": "1.0"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
    it('Invalid station check validation', function (done) {
        request(app)
            .post('/update/updateweatherstation')
            .send({
                "ID": "test_station1",
                "PASSWORD": "asdfgh",
                "data": [
                    {
                        "dateist": "2020-10-11 12:05:10.000000",
                        "dailyrainMM": "10",
                        "rain": [
                            "2020-12-11 12:05:10",
                            "2020-12-11 12:06:10",
                            "2020-12-11 12:07:10",
                            "2020-12-11 12:08:10"
                        ],
                        "tempc": 12.2,
                        "winddir": 12.5,
                        "windspeedkmh": 40,
                        "humidity": 16,
                        "baromMM": 10.0
                    }
                ],
                "health": {
                    "BAT": 12.2,
                    "network": "GSM",
                    "RSSI": 12.1
                },
                "action": "update",
                "softwareType": "Leecom",
                "version": "1.0"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});