import { validationResult } from 'express-validator'; // validating 

export const createPost = async (req, res) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            // 400 Bad Request
            const error = new Error('Bad Request');
            error.statusCode = 400; // The server did not understand the request
            throw error;
        }
        // Resolve the postService from the container
        const postService = req.container.resolve('postService');
        const post = await postService.createPost(req.body);
        res.status(201).send({ // Created
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

export const updatePost = async (req, res) => {
    try {
        const postService = req.container.resolve('postService');
        const userId = await postService.updatePost(req.params.id, req.body);
        res.status(200).send({ // OK
            message: 'Post updated successfully',
            data: { userId: userId }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

export const likePost = async (req, res) => {
    try {
        const postService = req.container.resolve('postService');
        const userId = await postService.likePost(req.params.id, req.body);
        res.status(200).send({ // OK
            message: 'Post like added successfully',
            data: { userId: userId }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

export const disLikePost = async (req, res) => {
    try {
        const postService = req.container.resolve('postService');
        const userId = await postService.dislikePost(req.params.id, req.body);
        res.status(200).send({ // OK
            message: 'Post dislike added successfully',
            data: { userId: userId }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postService = req.container.resolve('postService');
        const userId = await postService.deletePost(req.params.id, req.body);
        res.status(200).send({ // OK
            message: 'Post deleted successfully',
            data: { userId: userId }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

export const getAlltimeline = async (req, res) => {
    try {
        const userRepository = req.container.resolve('userRepository');
        const postService = req.container.resolve('postService', userRepository);
        const post = await postService.getAlltimeline({ 'userId': req.params.id });
        res.status(200).send({ // OK
            message: 'Post successfully',
            data: post
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}