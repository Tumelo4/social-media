export default class PostRepository {
    constructor({ postModel }) {
        this.postModel = postModel;
    }
    
    async createPost(postData) {
        const post = await new this.postModel(postData);
        await post.save();
        return post;
    }

    async findPost(userId) {
        const post = await this.postModel.findById(userId);
        return post;
    }

    async find(postData) {
        const post = await this.postModel.find(postData);
        return post;
    }

    async findByIdAndUpdate(userId, userData) {
        const post = await this.postModel.findByIdAndUpdate(userId, { $set: userData }, {new: true});
        return post;
    }

    async findByIdAndDelete(userId) {
        const post = await this.postModel.findByIdAndDelete(userId);
        return post;
    }

    async updateLikes(userId, otherUserId) {
        const post = await this.postModel.findByIdAndUpdate(userId, {
            $push: { likes: otherUserId },    
        }, { new: true });
        return post;
    }

    async removeLikes(userId, otherUserId) {
        const post = await this.postModel.findByIdAndUpdate(userId, {
            $pull: { likes: otherUserId },    
        }, { new: true });
        return post;
    }

    async updateDislikes(userId, otherUserId) {
        const post = await this.postModel.findByIdAndUpdate(userId, {
            $push: { dislike: otherUserId },    
        }, { new: true });
        return post;
    }

    async removeDislikes(userId, otherUserId) {
        const post = await this.postModel.findByIdAndUpdate(userId, {
            $pull: { dislike: otherUserId },    
        }, { new: true });
        return post;
    }
}