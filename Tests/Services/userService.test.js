import mongoose from "mongoose";
import UserRepository from "../../Repository/userRepository.js";
import userModel from "../../Models/userModel.js";
import UserService from "../../Services/userService.js";
import dotenv from 'dotenv';
import { _id, incorrectLength_id,users } from "../../Fixtures/usersFixtures.js";

dotenv.config();


describe('UserService', () => { 
    let userRepository ;
    let userService;

    beforeEach(async () => {
        await mongoose.connect(process.env.MONGO_URL_TESTS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        userRepository = new UserRepository({ userModel: userModel });
        userService = new UserService({ userRepository });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    }, 10000);

    afterEach(async () => {
        await userModel.deleteMany({});
    });

    describe('createUser', () => { 
        
        it('should create a new user', async () => { 
            const userId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            expect(userId).toBeDefined();
        });

        it('should throw a 409 error if the username or email already exists', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('Username or email already exists');
            error.statusCode = 409;
            await expect(userService.createUser(users[0].username, users[0].email, users[0].password)).rejects.toThrowError(error);
        });

        it('should throw a 500 error if an unexpected error occurs', async () => { 
            
            const error = new Error('Internal server error.');
            error.statusCode = 500;
            await expect(userService.createUser('', '', '')).rejects.toThrowError(error);
        });
    });

    describe('loginUser', () => { 
        test('should return a userId if credentials are correct', async () => {
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const userId = await userService.loginUser(users[0].email, users[0].password);
            expect(userId).toBeDefined();
        });

        test('should throw 401 if Email is incorrect', async () => {
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('Email is incorrect.');
            error.statusCode = 401;
            await expect(userService.loginUser('', users[0].password)).rejects.toThrowError(error);
        });

        test('should throw 401 if Password is incorrect', async () => {
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('Password is incorrect.');
            error.statusCode = 401;
            await expect(userService.loginUser(users[0].email, '')).rejects.toThrowError(error);
        });
    });

    describe('partialUpdateUser', () => { 
        test('Should update user if params id and userData[userId] are the same or isAdmin is true', async () => { 
            let userId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            expect(userId).toBeDefined();
            const UserData = { ...users[0], userId };
            userId = await userService.partialUpdateUser(userId, UserData);
            expect(userId).toBeDefined();
        });

        test('should throw 404 if userId or params id doesn\'t exists', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const UserData = { ...users[0], 'userId': _id };
            const error = new Error('User not found.');
            error.statusCode = 404;
            await expect(userService.partialUpdateUser(_id, UserData)).rejects.toThrowError(error);
        });

        test('should throw 422 if userId has incorrect length ', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const UserData = { ...users[0], 'userId': incorrectLength_id };
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(userService.partialUpdateUser(incorrectLength_id, UserData)).rejects.toThrowError(error);
        });

        test('should throw 403 if userId is not equal to params id and isAdmin is false or doesn\'t exists', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const UserData = { ...users[0], 'userId': _id };
            const error = new Error('You are not authorized to update this resource.');
            error.statusCode = 403;
            await expect(userService.partialUpdateUser(incorrectLength_id, UserData)).rejects.toThrowError(error);
        });
    });

    describe('deleteUser', () => { 
        test('should return delete user if params id and userId are the same and exists on database', async () => { 
            let userId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            expect(userId).toBeDefined();
            const UserData = { ...users[0], userId };
            userId = await userService.deleteUser(userId, UserData);
            expect(userId).toBeDefined();
        });

        test('should throw 404 if userId or params id doesn\'t exists', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const UserData = { ...users[0], 'userId': _id };
            const error = new Error('User not found.');
            error.statusCode = 404;
            await expect(userService.deleteUser(_id, UserData)).rejects.toThrowError(error);
        });

        test('should throw 422 if userId has incorrect length ', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const UserData = { ...users[0], 'userId': incorrectLength_id };
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(userService.deleteUser(incorrectLength_id, UserData)).rejects.toThrowError(error);
        });

        test('should throw 403 if userId is not equal to params id and isAdmin is false or doesn\'t exists', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const UserData = { ...users[0], 'userId': _id };
            const error = new Error('You are not authorized to delete this resource.');
            error.statusCode = 403;
            await expect(userService.deleteUser(incorrectLength_id, UserData)).rejects.toThrowError(error);
        });
    });

    describe('findUser', () => { 
        test('Should return part user docs if _id is correct', async () => {
            let userId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            expect(userId).toBeDefined();
            userId = await userService.findUser(userId);
            expect(userId).toBeDefined();
        });

        test('should throw 404 if _id is incorrect', async () => {
            const userId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            expect(userId).toBeDefined();
            const error = new Error('User not found.');
            error.statusCode = 404;
            await expect(userService.findUser(_id)).rejects.toThrowError(error);
        });

        test('should throw 422 if _id length is incorrect', async () => { 
            const userId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            expect(userId).toBeDefined();
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(userService.findUser(incorrectLength_id)).rejects.toThrowError(error);
        });
    });

    describe('followingUser', () => {
        test('Add userId to currUserId followings Array and currUserId to userId followers array ', async () => {
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const userId = await userService.createUser(users[1].username, users[1].email, users[1].password);

            const username = await userService.followingUser(currUserId, { userId });
            expect(username).toBe(users[1].username);
        });

        test('should throw a 400 if userId is not set', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            await userService.createUser(users[1].username, users[1].email, users[1].password);
            const error = new Error('missing or invalid data');
            error.statusCode = 400;
            await expect(userService.followingUser(currUserId, {})).rejects.toThrowError(error);
        });

        test('should throw a 400 if currUserId and userId are the same', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('Cannot follow yourself');
            error.statusCode = 400;
            await expect(userService.followingUser(currUserId, {'userId': currUserId})).rejects.toThrowError(error);
        });

        test('should throw a 404 if currUserId doesn\'t exists', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('User doesn\'t exists');
            error.statusCode = 404;
            await expect(userService.followingUser(_id, {'userId': currUserId})).rejects.toThrowError(error);
        });

        test('should throw a 404 if userId doesn\'t exists', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('User you want to follow doesn\'t exists');
            error.statusCode = 404;
            await expect(userService.followingUser(currUserId, {'userId': _id})).rejects.toThrowError(error);
        });

        test('should throw a 409 if userId contains in followings array  of currUserId', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const userId = await userService.createUser(users[1].username, users[1].email, users[1].password);

            let username = await userService.followingUser(currUserId, { userId });
            expect(username).toBe(users[1].username);

            const error = new Error('User is already following this other user');
            error.statusCode = 409;
            await expect(userService.followingUser(currUserId, { userId })).rejects.toThrowError(error);
        });

        test('should throw 422 if userId has incorrect length ', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const userId = await userService.createUser(users[1].username, users[1].email, users[1].password);
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(userService.followingUser(incorrectLength_id, { userId })).rejects.toThrowError(error);
        });
    });

    describe('unfollowUser', () => { 
        test('remove userId from currUserId followings arrays and  currUserId from userId follower array', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const userId = await userService.createUser(users[1].username, users[1].email, users[1].password);

            let username = await userService.followingUser(currUserId, { userId });
            expect(username).toBe(users[1].username);

            username = await userService.unfollowUser(currUserId, { userId });
            expect(username).toBe(users[1].username);
        });

        test('should throw a 400 if userId is not set', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            await userService.createUser(users[1].username, users[1].email, users[1].password);
            const error = new Error('missing or invalid data');
            error.statusCode = 400;
            await expect(userService.unfollowUser(currUserId, {})).rejects.toThrowError(error);
        });

        test('should throw a 400 if currUserId and userId are the same', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('Cannot follow yourself');
            error.statusCode = 400;
            await expect(userService.unfollowUser(currUserId, {'userId': currUserId})).rejects.toThrowError(error);
        });

        test('should throw a 404 if currUserId doesn\'t exists', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('User doesn\'t exists');
            error.statusCode = 404;
            await expect(userService.unfollowUser(_id, {'userId': currUserId})).rejects.toThrowError(error);
        });

        test('should throw a 404 if userId doesn\'t exists', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const error = new Error('User you want to unfollow doesn\'t exists');
            error.statusCode = 404;
            await expect(userService.unfollowUser(currUserId, {'userId': _id})).rejects.toThrowError(error);
        });

        test('should throw a 404 if currUser doesn\'t follow userId', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const userId = await userService.createUser(users[1].username, users[1].email, users[1].password);
            const error = new Error('User is not part of users you follow');
            error.statusCode = 404;
            await expect(userService.unfollowUser(currUserId, {userId})).rejects.toThrowError(error);
        });

        test('should throw 422 if userId has incorrect length ', async () => { 
            await userService.createUser(users[0].username, users[0].email, users[0].password);
            const userId = await userService.createUser(users[1].username, users[1].email, users[1].password);
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(userService.unfollowUser(incorrectLength_id, { userId })).rejects.toThrowError(error);
        });
    });
});