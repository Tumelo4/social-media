import _ from "lodash";

export default class PostService {
    constructor({ postRepository, userRepository }) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    async createPost(postData) {
        try {
            const allowedUpdates = ['userId', 'desc', 'img', 'likes', 'dislike'];
            let updates = _.pick(postData, allowedUpdates);
            const post = await this.postRepository.createPost(updates);
            return post;
        } catch (err) {
            const error = new Error('Internal server error.');
            error.statusCode = 500; // Internal Server Error
            throw error;
        }
    }

    async updatePost(paramsID, postData) {
        try {
            const allowedUpdates = ['userId', 'desc', 'img', 'likes', 'dislike'];
            let updates = _.pick(postData, allowedUpdates);
            let post = await this.postRepository.findPost(paramsID);
            
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404; // Not Found
                throw error;
            } else if (post._id.toString() !== updates.userId) {
                const error = new Error('Incorrect ID');
                error.statusCode = 400; // Bad request
                throw error;
            } 
            post = await this.postRepository.findByIdAndUpdate(paramsID, updates);
            return post;
        } catch (err) {
            if (err.statusCode === 404 || err.statusCode === 400) {
                throw err;
            }
            const error = new Error('_id length is incorrect');
            error.statusCode = 422; // Unprocessable Content
            throw error;
        }
    }


    async deletePost(paramsID, postData) {
        try {
            const allowedUpdates = ['userId', 'desc', 'img', 'likes', 'dislike'];
            let updates = _.pick(postData, allowedUpdates);
            let post = await this.postRepository.findPost(paramsID);

            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404; // Not Found
                throw error;
            } else if (post._id.toString() !== updates.userId) {
                const error = new Error('Incorrect ID');
                error.statusCode = 400; // Bad request
                throw error;
            } 
            post = await this.postRepository.findByIdAndDelete(paramsID);
            return post._id;
        } catch (err) {
            if (err.statusCode === 404 || err.statusCode === 400) {
                throw err;
            }
            const error = new Error('_id length is incorrect');
            error.statusCode = 422; // Unprocessable Content
            throw error;
        }
    }

    async likePost(paramsID, postData) {
        try {
            let post = await this.postRepository.findPost(paramsID);
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404; // Not Found
                throw error;
            } else if (post.likes.includes(postData.userId)) {
                post = await this.postRepository.removeLikes(paramsID, postData.userId);
                return post;
            } else {
                if (post.dislike.includes(postData.userId))
                {
                    await this.postRepository.removeDislikes(paramsID, postData.userId);
                }
                post = await this.postRepository.updateLikes(paramsID, postData.userId);
                return post;
            }

        } catch (err) {
            if (err.statusCode === 404) {
                throw err;
            }
            const error = new Error('_id length is incorrect');
            error.statusCode = 422; // Unprocessable Content
            throw error;
        }
    }
    
    async dislikePost(paramsID, postData) {
        try {
            let post = await this.postRepository.findPost(paramsID);
            if (!post) {
                const error = new Error('Post not found');
                error.statusCode = 404; // Not Found
                throw error;
            } else if (post.dislike.includes(postData.userId)) {
                post = await this.postRepository.removeDislikes(paramsID, postData.userId);
                return post;
            } else {
                if (post.likes.includes(postData.userId)) {
                    await this.postRepository.removeLikes(paramsID, postData.userId);
                }
                post = await this.postRepository.updateDislikes(paramsID, postData.userId);
                return post;
            }

        } catch (err) {
            if (err.statusCode === 404) {
                throw err;
            }
            const error = new Error('_id length is incorrect');
            error.statusCode = 422; // Unprocessable Content
            throw error;
        }
    }

    async getAlltimeline(postData) {
        try {
            const currentUser = await this.userRepository.findById(postData.userId);
            if (!currentUser) {
                const error = new Error('User not found');
                error.statusCode = 404; // Not Found
                throw error;
            }
            const userPosts = await this.postRepository.find({ userId: currentUser._id });
            const friendsPost = await Promise.all(
                currentUser.followings.map(friendId => {
                    try {
                        const posts = this.postRepository.find({ userId: friendId });
                        return posts;
                    } catch (error) {
                        return [];
                    }
                })
            );

            let PostArray = [...userPosts, ...friendsPost.flat()];
            PostArray.sort((a, b) => {
                if (a.updatedAt < b.updatedAt) return -1;
                if (a.updatedAt > b.updatedAt) return 1;
                return 0;
            });
            return PostArray;
        } catch (err) {

            if (err.statusCode === 404) {
                throw err;
            }
            const error = new Error('_id length is incorrect');
            error.statusCode = 422; // Unprocessable Content
            throw error;
        }
    }
}