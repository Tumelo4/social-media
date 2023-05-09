import { validationResult } from 'express-validator'; // validating 

// partial update
export const partialUpdateUser = async (req, res) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            // 400 Bad Request
            const error = new Error('Bad Request');
            error.statusCode = 400; // The server did not understand the request
            throw error;
        }
        // Resolve the userService from the container
        const userService = req.container.resolve('userService');
        const userId = await userService.partialUpdateUser(req.params.id, req.body);
        res.status(200).send({ // OK
            message: 'User updated successfully',
            data: { userId: userId }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

// delete user
export const deleteUser = async (req, res) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            // 400 Bad Request
            const error = new Error('Bad Request');
            error.statusCode = 400; // The server did not understand the request
            throw error;
        }
        // Resolve the userService from the container
        const userService = req.container.resolve('userService');
        const userId = await userService.deleteUser(req.params.id, req.body);
        res.status(200).send({ // OK
            message: 'User deleted successfully',
            data: { userId: userId }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

// read user
export const getUser = async (req, res) => {
    try {
        // Resolve the userService from the container
        const userService = req.container.resolve('userService');
        const user = await userService.findUser(req.params.id);
        res.status(200).send({ // OK
            message: 'successfully retrive user',
            data: { user }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

// following other user
export const followingUsers = async (req, res) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            // 400 Bad Request
            const error = new Error('Bad Request');
            error.statusCode = 400; // The server did not understand the request
            throw error;
        }
        // Resolve the userService from the container
        const userService = req.container.resolve('userService');
        const userName = await userService.followingUser(req.params.id, req.body);
        res.status(200).send({ // OK
            message: 'successfully follow other user',
            data: { username: userName }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}

// unfollow other user
export const unfollowUser = async (req, res) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            // 400 Bad Request
            const error = new Error('Bad Request');
            error.statusCode = 400; // The server did not understand the request
            throw error;
        }
        // Resolve the userService from the container
        const userService = req.container.resolve('userService');
        const userName = await userService.unfollowUser(req.params.id, req.body);
        res.status(200).send({ // OK
            message: 'successfully unfollow user',
            data: { username: userName }
        });
    } catch (error) {
        res.status(error.statusCode).send({ error: error.message });
    }
}