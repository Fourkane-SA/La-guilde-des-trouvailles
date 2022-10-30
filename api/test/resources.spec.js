const request = require('supertest');
const app = require('../app');

describe("resources", function() {
  
      describe("resources login", function() {
        it("post /api/resources/login", (done) => {
            request(app)
            .post('/api/resources/login')
            .expect(200)
            .end((error) => (error) ? done.fail(error) : done());
        });

    });

    describe("resources get", function() {
        it("get /api/resources/", (done) => {
            request(app)
            .get('/api/resources/')
            .set('Accept', 'application/json')
            .expect(200)
            .expect({
                "resources": [
                    {
                        "id": "francais",
                        "url": "https://pbs.twimg.com/profile_images/1298643948/FranceFlag_svg_400x400.png",
                        "position": [
                            45.78205527590259,
                            4.86594021320343
                        ],
                        "role": "player",
                        "ttl": 5,
                        "treasures": []
                    },
                    {
                        "id": "english",
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/langfr-225px-Flag_of_the_United_Kingdom_%283-5%29.svg.png",
                        "position": [
                            45.78163627232091,
                            4.863649606704712
                        ],
                        "role": "player",
                        "ttl": 5,
                        "treasures": []
                    },
                    {
                        "id": "potion de lune",
                        "url": "https://static.berceaumagique.com/photo/c5/5a/166826/400/1/lot-de-8-contenants-a-confiserie-coffre-au-tresor-pirate.jpg?1",
                        "position": [
                            1,
                            1
                        ],
                        "role": "object"
                    }
                ]
            })
            .end((error) => (error) ? done.fail(error) : done());
        });

    });

    describe("resources put /api/resources/:id", function() {
        it("put /api/resources/:id", (done) => {
            request(app)
            .put('/api/resources/francais')
            .send([11,11])
            .expect(200)
            .end((error) => (error) ? done.fail(error) : done());
        });

        it("get after put /api/resources/:id", (done) => {
            request(app)
            .put('/api/resources/francais')
            .send([11,11])

            request(app)
            .get('/api/resources/')
            .set('Accept', 'application/json')
            .expect(200)
            .expect({
                "resources": [
                    {
                        "id": "francais",
                        "url": "https://pbs.twimg.com/profile_images/1298643948/FranceFlag_svg_400x400.png",
                        "position": [
                            11,
                            11
                        ],
                        "role": "player",
                        "ttl": 5,
                        "treasures": []
                    },
                    {
                        "id": "english",
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/langfr-225px-Flag_of_the_United_Kingdom_%283-5%29.svg.png",
                        "position": [
                            45.78163627232091,
                            4.863649606704712
                        ],
                        "role": "player",
                        "ttl": 5,
                        "treasures": []
                    },
                    {
                        "id": "potion de lune",
                        "url": "https://static.berceaumagique.com/photo/c5/5a/166826/400/1/lot-de-8-contenants-a-confiserie-coffre-au-tresor-pirate.jpg?1",
                        "position": [
                            1,
                            1
                        ],
                        "role": "object"
                    }
                ]
            })
            .end((error) => (error) ? done.fail(error) : done());
        });
    });

    describe("resources put /api/resources/:id/image", function() {
        it("put /api/resources/:id/image", (done) => {
            request(app)
            .put('/api/resources/francais/image')
            .send({
                "url" : "image.png"
            })
            .expect(204)
            .end((error) => (error) ? done.fail(error) : done());
        });

        it("get after put /api/resources/:id/image", (done) => {
            request(app)
            .put('/api/resources/francais/image')
            .send({
                "url" : "image.png"
            })

            request(app)
            .get('/api/resources/')
            .set('Accept', 'application/json')
            .expect(200)
            .expect({
                "resources": [
                    {
                        "id": "francais",
                        "url": "image.png",
                        "position": [
                            11,
                            11
                        ],
                        "role": "player",
                        "ttl": 5,
                        "treasures": []
                    },
                    {
                        "id": "english",
                        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/langfr-225px-Flag_of_the_United_Kingdom_%283-5%29.svg.png",
                        "position": [
                            45.78163627232091,
                            4.863649606704712
                        ],
                        "role": "player",
                        "ttl": 5,
                        "treasures": []
                    },
                    {
                        "id": "potion de lune",
                        "url": "https://static.berceaumagique.com/photo/c5/5a/166826/400/1/lot-de-8-contenants-a-confiserie-coffre-au-tresor-pirate.jpg?1",
                        "position": [
                            1,
                            1
                        ],
                        "role": "object"
                    }
                ]
            })
            .end((error) => (error) ? done.fail(error) : done());
        });
        
    });
});