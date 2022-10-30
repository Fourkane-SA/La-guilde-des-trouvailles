const request = require('supertest');
const app = require('../app');

describe("admin", function() {
  
      describe("admin get", function() {
        it("get /admin/", (done) => {
            request(app)
            .get('/admin/')
            .set('Accept', 'application/json')
            .expect(200)
            .expect({
                "pos1": [],
                "pos2": [],
                "ttl": 60,
                "start": false
            })
            .end((error) => (error) ? done.fail(error) : done());
        });

    });

    describe("admin get resources", function() {
        it("get /admin/resources", (done) => {
            request(app)
            .get('/admin/resources')
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
                    }
                ]
            })
            .end((error) => (error) ? done.fail(error) : done());
        });
    });

    describe("admin get treasureRecovered", function() {
        it("get /admin/treasureRecovered", (done) => {
            request(app)
            .get('/admin/treasureRecovered')
            .set('Accept', 'application/json')
            .expect(200)
            .end((error) => (error) ? done.fail(error) : done());
        });

    });

    describe("admin updatePosition", function() {
        it("post /admin/updatePosition", (done) => {
            request(app)
            .post('/admin/updatePosition')
            .send({
                "pos1" : [1,1],
                "pos2" : [2,2]
            })
            .expect(200)
            .end((error) => (error) ? done.fail(error) : done());
        });

        it("get after /admin/updatePosition", (done) => {
            request(app)
            .post('/admin/updatePosition')
            .send({
                "pos1" : [1,1],
                "pos2" : [2,2]
            })

            request(app)
            .get('/admin/')
            .set('Accept', 'application/json')
            .expect(200)
            .expect({
                "pos1": [1,1],
                "pos2": [2,2],
                "ttl": 60,
                "start": false
            })
            .end((error) => (error) ? done.fail(error) : done());
        });
    });

        describe("admin start", function() {
            it("post /admin/start", (done) => {
                request(app)
                .post('/admin/start')
                .send({
                    "ttl": 60,
                    "tresorType": "potion de lune"
                })
                .expect(200)
                .end((error) => (error) ? done.fail(error) : done());
            });
    
            it("get after /admin/start", (done) => {
                request(app)
                .post('/admin/start')
                .send({
                    "ttl": 60,
                    "tresorType": "potion de lune"
                })
                
                request(app)
                .get('/admin/')
                .set('Accept', 'application/json')
                .expect(200)
                .expect({
                    "pos1": [1,1],
                    "pos2": [2,2],
                    "ttl": 60,
                    "tresorType": "potion de lune",
                    "start": true
                })
                .end((error) => (error) ? done.fail(error) : done());
            });
        });

        describe("admin addChest", function() {
            it("post /admin/addChest", (done) => {
                request(app)
                .post('/admin/addChest')
                .send({
                    "pos" : [1,1]
                })
                .expect(200)
                .end((error) => (error) ? done.fail(error) : done());
            });
    
            it("get after /admin/addChest", (done) => {
                request(app)
                .post('/admin/addChest')
                .send({
                    "pos" : [1,1]
                })
                
                request(app)
                .get('/admin/resources')
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

});