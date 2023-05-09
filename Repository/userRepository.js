export default class UserRepository {
    constructor({ userModel }) {
        this.userModel = userModel;
    }

    async createUser(userData) {
        const user = await new this.userModel(userData);
        await user.save();
        return user;
    }

    async loginUser(userData) {
        const user = await this.userModel.findOne(userData);
        return user;
    }

    async findUserByUsernameOrEmail(username, email) {
        const user = await this.userModel.findOne({ $or: [{ username }, { email }] });
        return user;
    }

    async findById(userId) {
        const user = await this.userModel.findById(userId);
        return user;
    }

    async findByIdAndUpdate(userId, userData) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: userData }, { new: true });
        return user;
    }

    async findByIdAndDelete(userId) {
        const user = await this.userModel.findByIdAndDelete(userId);
        return user;
    }

    async updateFollowers(userId, otherUserId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $push: { followers: otherUserId },
        });
    }

    async updateFollowings(userId, otherUserId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $push: { followings: otherUserId },    
        });
    }

    async unFollow(userId, otherUserId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $pull: { followers: otherUserId },
        });
    }

    async unFollowing(userId, otherUserId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $pull: { followings: otherUserId },
        });
    }

}