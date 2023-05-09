import mongoose from "mongoose";
import PostRepository from "../../Repository/postRepository.js";
import postModel from "../../Models/postModel.js";
import dotenv from 'dotenv';
import { posts } from "../../Fixtures/postFixtures.js";

dotenv.config();

describe('PostRepository', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL_TESTS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    }, 10000);

    afterEach(async () => {
        await postModel.deleteMany({});
    }, 10000);

    describe('createPost', () => {
        it('should create a new Post', async () => { 
            const postRepository = new PostRepository({ postModel: postModel });
            const post = await postRepository.createPost(posts[0]);
            expect(post).toHaveProperty('userId', posts[0].userId);
        });
    })

    describe('findPost', () => {
        it('Should return post if userId is correct', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const newPost = await postRepository.createPost(posts[1]);
            const post = await postRepository.findPost(newPost._id);
            
            expect(post).toHaveProperty('userId', posts[1].userId);
            expect(post).toHaveProperty('desc', posts[1].desc);
        });

        it('Should return null if userId is incorrect', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const newPost = await postRepository.createPost(posts[1]);
            const post = await postRepository.findPost(posts[1].userId);
            expect(post).toEqual(null);
        });
    });

    describe('find', () => { 
        it('Should return array of Post if query object is correct', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            await postRepository.createPost(posts[1]);
            await postRepository.createPost(posts[1]);
            const post = await postRepository.find(posts[1]);
           
            expect(post[0]).toHaveProperty('userId', posts[1].userId);
            expect(post[0]).toHaveProperty('desc', posts[1].desc);
        });

        it('Should return empty array  if query object is incorrect', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            await postRepository.createPost(posts[1]);
            await postRepository.createPost(posts[1]);
            const post = await postRepository.find(posts[0]);
            expect(post).toEqual([]); 
        });
    });

    describe('findByIdAndUpdate', () => {
        it('Should return updated Post if _id is correct', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const newPost = await postRepository.createPost(posts[1]);
            const post = await postRepository.findByIdAndUpdate(newPost._id, posts[2]);
            expect(post).toHaveProperty('userId', posts[1].userId);
            expect(post).toHaveProperty('desc', posts[2].desc);
        });

        it('Should return null if _id is incorrect', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            await postRepository.createPost(posts[1]);
            const post = await postRepository.findByIdAndUpdate(posts[1].userId, posts[2]);
            expect(post).toEqual(null);
        });
    });

    describe('findByIdAndDelete', () => {
        it('Should return deleted Post if _id is correct', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const newPost = await postRepository.createPost(posts[1]);
            const post = await postRepository.findByIdAndUpdate(newPost._id);
            expect(post).toHaveProperty('_id', newPost._id);
            expect(post).toHaveProperty('userId', posts[1].userId);
            expect(post).toHaveProperty('desc', posts[1].desc);
        });

        it('Should return null if _id is correct', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const newPost = await postRepository.createPost(posts[1]);
            const post = await postRepository.findByIdAndUpdate(posts[1].userId);
            expect(post).toEqual(null);
        });
    });

    describe('updateLikes', () => {
        it('should add the otherUserId to the userId Likes array', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const userPost = await postRepository.createPost(posts[1]);
            const otherUserPost = await postRepository.createPost(posts[0]);
            await postRepository.updateLikes(userPost._id, otherUserPost._id);
            const updatedUser = await postRepository.findPost(userPost._id);
            expect(updatedUser.likes).toEqual(expect.arrayContaining([otherUserPost._id]));
        });
    });

    describe('removeLikes', () => {
        it('should remove the otherUserId from the userId Likes array', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const userPost = await postRepository.createPost(posts[1]);
            const otherUserPost = await postRepository.createPost(posts[0]);
            await postRepository.updateLikes(userPost._id, otherUserPost._id);
            let updatedUser = await postRepository.findPost(userPost._id);
            expect(updatedUser.likes).toEqual(expect.arrayContaining([otherUserPost._id]));

            await postRepository.removeLikes(userPost._id, otherUserPost._id);
            updatedUser = await postRepository.findPost(userPost._id);
            expect(updatedUser.likes).not.toEqual(expect.arrayContaining([otherUserPost._id]));
        });
    });

    describe('updateDislikes', () => {
        it('should add the otherUserId to the userId dislikes array', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const userPost = await postRepository.createPost(posts[1]);
            const otherUserPost = await postRepository.createPost(posts[0]);
            await postRepository.updateDislikes(userPost._id, otherUserPost._id);
            const updatedUser = await postRepository.findPost(userPost._id);
            expect(updatedUser.dislike).toEqual(expect.arrayContaining([otherUserPost._id]));
        });
    });

    describe('removeDislikes', () => {
        it('Should remove the otherUserId from the UserId dislikes array', async () => {
            const postRepository = new PostRepository({ postModel: postModel });
            const userPost = await postRepository.createPost(posts[1]);
            const otherUserPost = await postRepository.createPost(posts[0]);
            await postRepository.updateDislikes(userPost._id, otherUserPost._id);
            let updatedUser = await postRepository.findPost(userPost._id);
            expect(updatedUser.dislike).toEqual(expect.arrayContaining([otherUserPost._id]));

            await postRepository.removeDislikes(userPost._id, otherUserPost._id);
            updatedUser = await postRepository.findPost(userPost._id);
            expect(updatedUser.dislike).not.toEqual(expect.arrayContaining([otherUserPost._id]));
        })
    });
});