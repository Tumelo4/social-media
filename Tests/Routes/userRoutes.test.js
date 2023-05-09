import supertest from "supertest";
import { app, server } from '../../index.js';
import { users, _id, incorrectLength_id } from "../../Fixtures/usersFixtures.js";
import userModel from "../../Models/userModel.js";
import mongoose from "mongoose";


describe('Test the user routes', () => { 
    let responseArray = [];
    afterAll(async () => {
        await userModel.deleteMany({});
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

    describe('PartialUpdateUser', () => { 
        test('should update user with valid _id', async () => { 
            const body = { ...users[5], 'userId': responseArray[0] };
            const response = await supertest(app).patch('/api/user/'+ responseArray[0]).send(body);
            expect(response.status).toBe(200);
        });

        test('should response with 400', async () => { 
            const response = await supertest(app).patch('/api/user/'+ responseArray[0]).send({});
            expect(response.status).toBe(400);
        });

        test('should response with 404', async () => { 
            const response = await supertest(app).patch('/api/user/'+ _id).send({'userId': _id});
            expect(response.status).toBe(404);
        });

        test('should response with 422', async () => { 
            const response = await supertest(app).patch('/api/user/'+ incorrectLength_id).send({'userId': incorrectLength_id});
            expect(response.status).toBe(422);
        });

        test('should response with 403', async () => { 
            const response = await supertest(app).patch('/api/user/'+ responseArray[0]).send({'userId': incorrectLength_id});
            expect(response.status).toBe(403);
        });
    });

    describe('DeleteUser', () => { 
        test('should delete user with valid _id', async () => { 
            const body = { ...users[5], 'userId': responseArray[0] };
            const response = await supertest(app).delete('/api/user/'+ responseArray[0]).send(body);
            expect(response.status).toBe(200);
        });

        test('should response with 400', async () => { 
            const response = await supertest(app).delete('/api/user/'+ responseArray[0]).send({});
            expect(response.status).toBe(400);
        });

        test('should response with 404', async () => { 
            const response = await supertest(app).delete('/api/user/'+ _id).send({'userId': _id});
            expect(response.status).toBe(404);
        });

        test('should response with 422', async () => { 
            const response = await supertest(app).delete('/api/user/'+ incorrectLength_id).send({'userId': incorrectLength_id});
            expect(response.status).toBe(422);
        });

        test('should response with 403', async () => { 
            const response = await supertest(app).delete('/api/user/'+ responseArray[0]).send({'userId': incorrectLength_id});
            expect(response.status).toBe(403);
        });
    });

    describe('GetUser', () => { 
        test('should get user with a valid _id', async () => { 
            const response = await supertest(app).get('/api/user/'+ responseArray[1]).send();
            expect(response.status).toBe(200);
        });

        test('should response with 404', async () => { 
            const response = await supertest(app).get('/api/user/'+ _id).send();
            expect(response.status).toBe(404);
        });

        test('should response with 422', async () => { 
            const response = await supertest(app).get('/api/user/'+ incorrectLength_id).send();
            expect(response.status).toBe(422);
        });
    });

    describe('FollowingUsers', () => { 
        test('Should follow other user', async () => { 
            const body = { ...users[5], 'userId': responseArray[2] };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/follow').send(body);
            expect(response.status).toBe(200);
        });

        test('Should response with 400 if userId was not set', async () => { 
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/follow').send({});
            expect(response.status).toBe(400);
        });

        test('Should response with 400 if userId and current user are the same', async () => { 
            const body = { ...users[5], 'userId': responseArray[1] };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/follow').send(body);
            expect(response.status).toBe(400);
        });

        test('Should response with 404 if current user _id doesn\'t exist', async () => { 
            const body = { ...users[5], 'userId': responseArray[1] };
            const response = await supertest(app).patch('/api/user/'+ _id +'/follow').send(body);
            expect(response.status).toBe(404);
        });

        test('Should response with 404 if  user _id doesn\'t exist', async () => { 
            const body = { ...users[5], 'userId': _id };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1] +'/follow').send(body);
            expect(response.status).toBe(404);
        });

        test('Should response with 409 if userId already included  as followings', async () => { 
            const body = { ...users[5], 'userId': responseArray[2] };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/follow').send(body);
            expect(response.status).toBe(409);
        });

        test('should response with 422', async () => { 
            const body = { ...users[5], 'userId': incorrectLength_id };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/follow').send(body);
            expect(response.status).toBe(422);
        });

    });

    describe('unfollowUser', () => { 
        test('Should follow other user', async () => { 
            const body = { ...users[5], 'userId': responseArray[2] };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/unfollow').send(body);
            expect(response.status).toBe(200);
        });

        test('Should response with 400 if userId was not set', async () => { 
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/unfollow').send({});
            expect(response.status).toBe(400);
        });

        test('Should response with 400 if userId and current user are the same', async () => { 
            const body = { ...users[5], 'userId': responseArray[1] };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/unfollow').send(body);
            expect(response.status).toBe(400);
        });

        test('Should response with 404 if current user _id doesn\'t exist', async () => { 
            const body = { ...users[5], 'userId': responseArray[1] };
            const response = await supertest(app).patch('/api/user/'+ _id +'/unfollow').send(body);
            expect(response.status).toBe(404);
        });

        test('Should response with 404 if  user _id doesn\'t exist', async () => { 
            const body = { ...users[5], 'userId': _id };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1] +'/unfollow').send(body);
            expect(response.status).toBe(404);
        });

        test('Should response with 404 if userId is not included a followings', async () => { 
            const body = { ...users[5], 'userId': responseArray[2] };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/unfollow').send(body);
            expect(response.status).toBe(404);
        });

        test('should response with 422', async () => { 
            const body = { ...users[5], 'userId': incorrectLength_id };
            const response = await supertest(app).patch('/api/user/'+ responseArray[1]+'/unfollow').send(body);
            expect(response.status).toBe(422);
        });

    });
});