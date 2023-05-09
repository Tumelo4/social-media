import mongoose from "mongoose";
import PostRepository from "../../Repository/postRepository.js";
import postModel from "../../Models/postModel.js";
import dotenv from 'dotenv';
import { posts } from "../../Fixtures/postFixtures.js";
import PostService from "../../Services/postService.js";
import UserRepository from "../../Repository/userRepository.js";
import UserService from "../../Services/userService.js";
import userModel from "../../Models/userModel.js";
import { users } from "../../Fixtures/usersFixtures.js";

import {
    createContainer,
    asClass,
    asValue
} from "awilix";
import { _id } from "../../Fixtures/usersFixtures.js";

dotenv.config();

const container = createContainer();

// Register your dependencies
container.register({
  userRepository: asClass(UserRepository),
  userService: asClass(UserService),
  userModel: asValue(userModel),

  postRepository: asClass(PostRepository),
  postService: asClass(PostService),
  postModel: asValue(postModel),
});

describe('PostService', () => { 
    let userService ;
    let postService;

    beforeEach(async () => {
        await mongoose.connect(process.env.MONGO_URL_TESTS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        postService = container.resolve('postService');
        userService = container.resolve('userService');
    }, 10000);

    afterAll(async () => {
        await mongoose.connection.close();
    }, 10000);

    afterEach(async () => {
        await postModel.deleteMany({});
        await userModel.deleteMany({});
    });

    describe('createPost', () => { 
        test('should create a new post', async () => { 
            const post = await postService.createPost(posts[0]);
            expect(post).toBeDefined();
            expect(post).toHaveProperty('userId', posts[0].userId);
        });
    });

    describe('updatePost', () => { 
        test('should update a post when valid data is provided', async () => { 
            let post = await postService.createPost(posts[0]);
            const update = { ...post._doc, 'desc': 'Update Post' };

            post = await postService.updatePost(update._id, update);
            expect(post).toHaveProperty('desc', update.desc);
        });

        test('should throw a 404 error when post is not found because params id is incorrect', async () => { 
            let post = await postService.createPost(posts[0]);
            const update = { ...post._doc, 'desc': 'Update Post' };
            const error = new Error('Post not found');
            error.statusCode = 404;
            await expect(postService.updatePost(update.userId, update)).rejects.toThrowError(error);
        });

        test('should throw a 400 error when userId is incorrect', async () => {
            let post = await postService.createPost(posts[0]);
            const update = { ...post._doc, 'userId': posts[1].userId };
            const error = new Error('Incorrect ID');
            error.statusCode = 400;
            await expect(postService.updatePost(update._id, update)).rejects.toThrowError(error);
        });

        test('should throw a 422 error when _id length is incorrect', async () => { 
            let post = await postService.createPost(posts[0]);
            const update = { ...post._doc, 'desc': 'Update Post' };
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(postService.updatePost(posts[3].userId, update)).rejects.toThrowError(error);
        });
    });

    describe('deletePost', () => { 
        test('should delete a post when valid data is provided', async () => { 
            let post = await postService.createPost(posts[0]);
            const update = { ...post._doc};

            post = await postService.deletePost(update._id, update);
            expect(post).toStrictEqual(update._id);
        });

        test('should throw a 404 error when post is not found because params id is incorrect', async () => { 
            let post = await postService.createPost(posts[0]);
            const update = { ...post._doc};
            const error = new Error('Post not found');
            error.statusCode = 404;
            await expect(postService.deletePost(update.userId, update)).rejects.toThrowError(error);
        });

        test('should throw a 400 error when userId is incorrect', async () => {
            let post = await postService.createPost(posts[0]);
            const update = { ...post._doc, 'userId': posts[1].userId };
            const error = new Error('Incorrect ID');
            error.statusCode = 400;
            await expect(postService.deletePost(update._id, update)).rejects.toThrowError(error);
        });

        test('should throw a 422 error when _id length is incorrect', async () => { 
            let post = await postService.createPost(posts[0]);
            const update = { ...post._doc, 'desc': 'Update Post' };
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(postService.deletePost(posts[3].userId, update)).rejects.toThrowError(error);
        });
    });

    describe('likePost', () => { 
        test('should successfully like a post', async () => { 
            let post = await postService.createPost(posts[0]);
            post = await postService.likePost(post._id, { 'userId': posts[0].userId });
            
            expect(post.likes).toEqual(expect.arrayContaining([posts[0].userId]));
        });

        test('should remove like a post if already in like array', async () => { 
            let post = await postService.createPost(posts[0]);
            post = await postService.likePost(post._id, { 'userId': posts[0].userId });
            post = await postService.likePost(post._id, { 'userId': posts[0].userId });
            expect(post.likes).not.toEqual(expect.arrayContaining([posts[0].userId]));
        }); 

        test('should throw a 404 if post for provided Id it doesn\'t exists', async () => { 
            const error = new Error('Post not found');
            error.statusCode = 404;
            await expect(postService.likePost(posts[0].userId, { 'userId': posts[0].userId })).rejects.toThrowError(error);
        });

        test('should throw a 422 error when _id length is incorrect', async () => { 
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(postService.likePost(posts[3].userId, { 'userId': posts[0].userId })).rejects.toThrowError(error);
        });
    });

    describe('dislikePost', () => { 
        test('should successfully dislike a post', async () => { 
            let post = await postService.createPost(posts[0]);
            post = await postService.dislikePost(post._id, { 'userId': posts[0].userId });
            expect(post.dislike).toEqual(expect.arrayContaining([posts[0].userId]));
        });

        test('should remove like a post if already in like array', async () => { 
            let post = await postService.createPost(posts[0]);
            post = await postService.dislikePost(post._id, { 'userId': posts[0].userId });
            post = await postService.dislikePost(post._id, { 'userId': posts[0].userId });
            expect(post.dislike).not.toEqual(expect.arrayContaining([posts[0].userId]));
        }); 

        test('should throw a 404 if post for provided Id it doesn\'t exists', async () => { 
            const error = new Error('Post not found');
            error.statusCode = 404;
            await expect(postService.dislikePost(posts[0].userId, { 'userId': posts[0].userId })).rejects.toThrowError(error);
        });

        test('should throw a 422 error when _id length is incorrect', async () => { 
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(postService.dislikePost(posts[3].userId, { 'userId': posts[0].userId })).rejects.toThrowError(error);
        });
    });


    describe('getAlltimeline', () => { 
        test('should return an array of posts', async () => { 
            const currUserId = await userService.createUser(users[0].username, users[0].email, users[0].password);
            const userId = await userService.createUser(users[1].username, users[1].email, users[1].password);
            
            await userService.followingUser(currUserId, { userId });
            let input = { ...posts[0], 'userId': currUserId };
            await postService.createPost(input);
            input = { ...posts[1], 'userId': userId };
            postService.createPost(input);
            const getAllTime = await postService.getAlltimeline({ 'userId': currUserId });
            
            expect(getAllTime).toBeDefined();
        });

        test('should throw a 404 error if the user is not found', async () => { 
            const error = new Error('User not found');
            error.statusCode = 404;
            await expect(postService.getAlltimeline({ 'userId': posts[0].userId })).rejects.toThrowError(error);
        });

        test('should throw a 422 error if the provided Id is incorrect', async () => { 
            const error = new Error('_id length is incorrect');
            error.statusCode = 422;
            await expect(postService.getAlltimeline({ 'userId': posts[3].userId })).rejects.toThrowError(error);
        });
    });
});