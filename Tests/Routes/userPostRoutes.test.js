import supertest from "supertest";
import { app, server } from '../../index.js';
import { users, _id, incorrectLength_id } from "../../Fixtures/usersFixtures.js";
import userModel from "../../Models/userModel.js";
import postModel from "../../Models/postModel.js";
import mongoose from "mongoose";
import { posts } from "../../Fixtures/postFixtures.js";


describe('Post Routes', () => { 
    let responseArray = [];
    let responsePostArray = [];
    afterAll(async () => {
        await userModel.deleteMany({});
        await postModel.deleteMany({});
        await mongoose.connection.close();
        server.close();
    }, 10000);

    describe('Registration', () => { 
        test('should register a new user', async () => { 
            let response = await supertest(app).post('/api/auth/register').send(users[0]);
            expect(response.status).toBe(201);
            responseArray = [...responseArray, response.body.data.userId];
            response = await supertest(app).post('/api/auth/register').send(users[1]);
            expect(response.status).toBe(201);
            responseArray = [...responseArray, response.body.data.userId];
            response = await supertest(app).post('/api/auth/register').send(users[2]);
            expect(response.status).toBe(201);
            responseArray = [...responseArray, response.body.data.userId];
        }, 20000);
    });

    describe('FollowingUsers', () => { 
        test('Should follow other user', async () => { 
            let body = { ...users[5], 'userId': responseArray[2] };
            let response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/follow').send(body);
            expect(response.status).toBe(200);
            expect(response.status).toBe(200);
            body = { ...users[5], 'userId': responseArray[0] };
            response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/follow').send(body);
            expect(response.status).toBe(200);
        });
    });

    describe('Create a post', () => {
        test('should add new post', async () => {
            let body = { 'userId': responseArray[0] };
            let response = await supertest(app).post('/api/posts/').send(body);
            responsePostArray = [...responsePostArray, response.body.data._id];
            expect(response.status).toBe(201);

            body = { 'userId': responseArray[1] };
            response = await supertest(app).post('/api/posts/').send(body);
            responsePostArray = [...responsePostArray, response.body.data._id];
            expect(response.status).toBe(201);

            body = { 'userId': responseArray[2] };
            response = await supertest(app).post('/api/posts/').send(body);
            responsePostArray = [...responsePostArray, response.body.data._id];
            expect(response.status).toBe(201);
        }, 10000);

        test('should response with 400 status', async () => {
            const response = await supertest(app).post('/api/posts/').send({});
            expect(response.status).toBe(400);
        });
    });

    describe('Update Post', () => { 
        test('Should update post with correct _id', async () => {
            const body = { ...posts[1],'userId': responsePostArray[0] };
            const response = await supertest(app).put('/api/posts/' + responsePostArray[0]).send(body);
            expect(response.status).toBe(200);
        });

        test('Should response 400', async () => { 
            const body = { ...posts[1], 'userId': posts[0].userId };
            const response = await supertest(app).put('/api/posts/' + responsePostArray[0]).send(body);
            expect(response.status).toBe(400);
        });

        test('Should response 404', async () => { 
            const body = { ...posts[1],'userId': responseArray[0] };
            const response = await supertest(app).put('/api/posts/' + posts[0].userId).send(body);
            expect(response.status).toBe(404);
        });

        test('Should response 422', async () => { 
            const body = { ...posts[1],'userId': incorrectLength_id };
            const response = await supertest(app).put('/api/posts/' + incorrectLength_id).send(body);
            expect(response.status).toBe(422);
        });
    });

    describe('Like Post', () => { 
        test('Should like Post', async () => { 
            let body = { ...posts[1],'userId': responsePostArray[1] };
            let response = await supertest(app).patch('/api/posts/' + responsePostArray[0] + '/likes').send(body);
            expect(response.status).toBe(200);

            body = { ...posts[1],'userId': responsePostArray[2] };
            response = await supertest(app).patch('/api/posts/' + responsePostArray[0] + '/likes').send(body);
            expect(response.status).toBe(200);
        });

        test('Should response 404', async () => { 
            const body = { ...posts[1],'userId': responsePostArray[1] };
            const response = await supertest(app).patch('/api/posts/' + posts[0].userId + '/likes').send(body);
            expect(response.status).toBe(404);
        });

        test('Should response 422', async () => { 
            const body = { ...posts[1],'userId': responsePostArray[1] };
            const response = await supertest(app).patch('/api/posts/' + incorrectLength_id + '/likes').send(body);
            expect(response.status).toBe(422);
        });
    });

    describe('Dislike Post', () => { 
        test('Should like Post', async () => { 
            let body = { ...posts[1],'userId': responsePostArray[1] };
            let response = await supertest(app).patch('/api/posts/' + responsePostArray[0] + '/dislike').send(body);
            expect(response.status).toBe(200);

            body = { ...posts[1],'userId': responsePostArray[2] };
            response = await supertest(app).patch('/api/posts/' + responsePostArray[0] + '/dislike').send(body);
            expect(response.status).toBe(200);
        });

        test('Should response 404', async () => { 
            const body = { ...posts[1],'userId': responsePostArray[1] };
            const response = await supertest(app).patch('/api/posts/' + posts[0].userId + '/dislike').send(body);
            expect(response.status).toBe(404);
        });

        test('Should response 422', async () => { 
            const body = { ...posts[1],'userId': responsePostArray[1] };
            const response = await supertest(app).patch('/api/posts/' + incorrectLength_id + '/dislike').send(body);
            expect(response.status).toBe(422);
        });
    });

    describe('Get All Timeline', () => { 
        test('Get All Timeline if userId is correct', async () => { 
            const response = await supertest(app).get('/api/posts/' + responseArray[0]).send();
            expect(response.status).toBe(200);
        });

        test('should response 404 if id is incorrect', async () => { 
            const response = await supertest(app).get('/api/posts/' + posts[0].userId).send();
            expect(response.status).toBe(404);
        });

        test('should response 422', async () => { 
            const response = await supertest(app).get('/api/posts/' + incorrectLength_id).send();
            expect(response.status).toBe(422);
        });
    });

    describe('Delete Post', () => { 
        test('Should delete post with correct _id', async () => {
            const body = { ...posts[1],'userId': responsePostArray[0] };
            const response = await supertest(app).delete('/api/posts/' + responsePostArray[0]).send(body);
            expect(response.status).toBe(200);
        });

        test('Should response 400', async () => { 
            const body = { ...posts[1],'userId':  posts[0].userId };
            const response = await supertest(app).delete('/api/posts/' + responsePostArray[1]).send(body);
            expect(response.status).toBe(400);
        });

        test('Should response 404', async () => { 
            const body = { ...posts[1],'userId': responseArray[0] };
            const response = await supertest(app).delete('/api/posts/' + posts[0].userId).send(body);
            expect(response.status).toBe(404);
        });

        test('Should response 422', async () => { 
            const body = { ...posts[1],'userId': responseArray[0] };
            const response = await supertest(app).delete('/api/posts/' + incorrectLength_id).send(body);
            expect(response.status).toBe(422);
        });
    });
});