const request = require('supertest');
const app = require('../app')

describe("GET /stations", () => {
    describe('Server status check', () => {
        test('check server status', async () => {
            const response = await request(app).get('/status').set('Accept', 'application/json')
            expect(response.status).toEqual(200);
        })
    })


    describe('All station Route testing', () => {
        test("Get All stations", async () => {
            const response = await request(app).get("/stations").set('Accept', 'application/json')
            expect(response.status).toEqual(200);
        })
    })
    describe('Specific station Methods by ID', () => {
        test('Get Specific Station', async () => {
            const response = await request(app).get("/stations/curw_ws_attidiya").set('Accept', 'application/json')
            expect(response.status).toEqual(200);
        })
        test('Get Specific Station for wrong id', async () => {
            const response = await request(app).get("/stations/curw_ws_attidiyaWrong").set('Accept', 'application/json')
            expect(response.status).toEqual(204);
        })
    })

    describe('Specific station Methods by Name', () => {
        test('Get Specific Station', async () => {
            const response = await request(app).get("/stations/findbyname/attidi").set('Accept', 'application/json')
            expect(response.status).toEqual(200);
        })
        test('Specific station Methods by Name', async () => {
            const response = await request(app).get("/stations/findbyname/768").set('Accept', 'application/json')
            expect(response.status).toEqual(204);
        })
    })

    describe('Insert Station into database', () => {
        test('Insert into database', async () => {
            const response = await request(app).post("/stations").set('Accept', 'application/json').send(
                {
                    "station_id": "curw_test_station",
                    "station_password": "this is just a test password",
                    "station_name": "station_name",
                    "latitude": 100.0,
                    "longitude": 12.2,
                    "description": "this is a test station",
                    "station_type": 0,
                    "domestic_contact": "076677323123",
                    "place": "test_location_metro area"
                }
            )
            expect(response.status).toEqual(201);

        })
        test('Insert duplicate data into database', async () => {
            const response = await request(app).post("/stations").set('Accept', 'application/json').send(
                {
                    "station_id": "curw_test_station",
                    "station_password": "this is just a test password",
                    "station_name": "station_name",
                    "latitude": 100.0,
                    "longitude": 12.2,
                    "description": "this is a test station",
                    "station_type": 0,
                    "domestic_contact": "076677323123",
                    "place": "test_location_metro area"
                }
            )
            expect(response.status).toEqual(208);

        })
        test('Insert Error data missing ID into database', async () => {
            const response = await request(app).post("/stations").set('Accept', 'application/json').send(
                {
                    "station_password": "this is just a test password",
                    "station_name": "station_name",
                    "latitude": 100.0,
                    "longitude": 12.2,
                    "description": "this is a test station",
                    "station_type": 0,
                    "domestic_contact": "076677323123",
                    "place": "test_location_metro area"
                }
            )
            expect(response.status).toEqual(422);

        })
    })

    describe('Update station station by ID', () => {
        test('Update station with correct id', async () => {
            const response = await request(app).put("/stations/curw_test_station").set('Accept', 'application/json').send(
                {
                    "station_id": "curw_test_station_1",
                    "station_password": "this is just a test password",
                    "station_name": "station_name",
                    "latitude": 100.0,
                    "longitude": 12.2,
                    "description": "this is a test station",
                    "station_type": 0,
                    "domestic_contact": "076677323123",
                    "place": "test_location_metro area"
                }
            )
            expect(response.status).toEqual(200);
        })
        test('update station for incorrect id', async () => {
            const response = await request(app).put("/stations/curw_test_station_wrong_id").set('Accept', 'application/json').send(
                {
                    "station_id": "curw_test_station_1",
                    "station_password": "this is just a test password",
                    "station_name": "station_name",
                    "latitude": 100.0,
                    "longitude": 12.2,
                    "description": "this is a test station",
                    "station_type": 0,
                    "domestic_contact": "076677323123",
                    "place": "test_location_metro area"
                }
            )
            expect(response.status).toEqual(204);
        })

    })

    describe('Delete station by ID', () => {
        test('Delete station', async () => {
            const response = await request(app).delete("/stations/curw_test_station_1").set('Accept', 'application/json')
            expect(response.status).toEqual(200);
        })
        test('Delete station for wrong id', async () => {
            const response = await request(app).delete("/stations/wrong_id").set('Accept', 'application/json')
            expect(response.status).toEqual(204)
            done()
        })
    })
})