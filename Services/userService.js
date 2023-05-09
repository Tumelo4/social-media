import bcrypt from "bcrypt";
import _ from "lodash";

export default class UserService {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    
    async createUser(username, email, password ) {
        try {
            // check if username or email already exists
            const existingUser = await this.userRepository.findUserByUsernameOrEmail(username, email);
            if (existingUser) {
                const error = new Error('Username or email already exists');
                error.statusCode = 409; // Conflict
                throw error;
            }
            // Generate a salt to use for hashing the password
            const saltRounds = 12;
            const salt = await bcrypt.genSalt(saltRounds);
            // Hash the password using the generated salt
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const user = await this.userRepository.createUser({
                'username': username,
                'email': email,
                'password': hashedPassword,
            });
            return user._id;
        } catch (err) {
            if (err.statusCode === 409) {
                throw err;
            }
            const error = new Error('Internal server error.');
            error.statusCode = 500; // Internal Server Error
            throw error;
        }
    }

    async loginUser(email, password) {
        try {

            const user = await this.userRepository.loginUser({
                'email': email,
            });
            // check if email exist on database
            if (!user) {
                const error = new Error('Email is incorrect.');
                error.statusCode = 401; // Unauthorized
                throw error;
            }
            const validatePassword = await bcrypt.compare(password, user.password);
            if (!validatePassword) {
                const error = new Error('Password is incorrect.');
                error.statusCode = 401; // Unauthorized
                throw error;
            }
            return user._id;
        } catch (err) {
            if (err.statusCode === 401) {
                throw err;
            }
            
            const error = new Error('Internal server error.');
            error.statusCode = 500; // Internal Server Error
            throw error;
        }
    }

    async partialUpdateUser(paramsId, userData) {
        const { userId, isAdmin, password } = userData;
       
        if (userId === paramsId || isAdmin) {
            try {
                // Check if user is authorized to perform the update
                const user = await this.userRepository.findById(userId);
                
                if (!user) {
                    const error = new Error('User not found.');
                    error.statusCode = 404; // Not Found
                    throw error;
                }
                
                if (password) {
                    // Generate a salt to use for hashing the password
                    const saltRounds = 12;
                    const salt = await bcrypt.genSalt(saltRounds);
                    // Hash the password using the generated salt
                    const hashedPassword = await bcrypt.hash(password, salt);
                    userData.password = hashedPassword;
                }
                // List of allowed properties to update
                const allowedUpdates = ['username', 'email', 'password', 'profile_picture',
                    'cover_picture', 'followers', 'followings', 'desc', 'city', 'from', 'relationship'];
                // Pick only allowed properties from userData
                let updates = _.pick(userData, allowedUpdates);
                // Update the user 
                const updatedUser = await this.userRepository.findByIdAndUpdate(userId, updates);
                return updatedUser._id;
            } catch (err) {
                
                if (err.statusCode === 404) {
                    throw err;
                }
                const error = new Error('_id length is incorrect');
                error.statusCode = 422; // Unprocessable Content
                throw error;
            }
        } else {
            const error = new Error('You are not authorized to update this resource.');
            error.statusCode = 403; // Forbidden
            throw error;
        }
    }

    // delete user by _id
    async deleteUser(paramsId, userData) {
        const { userId, isAdmin} = userData;
       
        if (userId === paramsId || isAdmin) {
            try {
                // Check if user is authorized to perform the update
                const user = await this.userRepository.findById(userId);
                
                if (!user) {
                    const error = new Error('User not found.');
                    error.statusCode = 404; // Not Found
                    throw error;
                }
                
                const updatedUser = await this.userRepository.findByIdAndDelete(userId);
                return updatedUser._id;
            } catch (err) {
                
                if (err.statusCode === 404) {
                    throw err;
                }
                const error = new Error('_id length is incorrect');
                error.statusCode = 422; // Unprocessable Content
                throw error;
            }
        } else {
            const error = new Error('You are not authorized to delete this resource.');
            error.statusCode = 403; // Forbidden
            throw error;
        }
    }

    // find user by id
    async findUser(userId) {
        try {
            const user = await this.userRepository.findById(userId);
                
            if (!user) {
                const error = new Error('User not found.');
                error.statusCode = 404; // Not Found
                throw error;
            }
            const { password, createdAt, updatedAt, ...other } = user;
            return other;
        } catch (err) {
            if (err.statusCode === 404) {
                throw err;
            }
            const error = new Error('_id length is incorrect');
            error.statusCode = 422; // Unprocessable Content
            throw error;
        }
    }

    // following other user
    async followingUser(currUserId, userData) {
        
        const { userId } = userData;
        
        try {
            if (!userId) {
                const error = new Error('missing or invalid data');
                error.statusCode = 400; // Bad request
                throw error;
            } else if (currUserId === userId) {
                const error = new Error('Cannot follow yourself');
                error.statusCode = 400; // Bad request
                throw error;
            } else {
                
                const currUser = await this.userRepository.findById(currUserId);
                if (!currUser) {
                    const error = new Error('User doesn\'t exists');
                    error.statusCode = 404; // Not Found
                    throw error;
                }
                
                const otherUser = await this.userRepository.findById(userId);
                
                if (!otherUser) {
                    const error = new Error('User you want to follow doesn\'t exists');
                    error.statusCode = 404; // Not Found
                    throw error;
                }
                
                
                if (!otherUser.followers.includes(currUserId)) {
                    
                    await this.userRepository.updateFollowers(userId, currUserId);
                    await this.userRepository.updateFollowings(currUserId, userId);
                    return otherUser.username;
                } else {
                    const error = new Error('User is already following this other user');
                    error.statusCode = 409; // Conflict
                    throw error;
                }
            }

        } catch (err) {
            if (err.statusCode === 400 || err.statusCode === 404 || err.statusCode === 409) {
                throw err;
            }
            const error = new Error('_id length is incorrect');
            error.statusCode = 422; // Unprocessable Content
            throw error;
        }
    }

    // unfollow other user 
    async unfollowUser(currUserId, userData) {
        const { userId } = userData;
        try {
            if (!userId) {
                const error = new Error('missing or invalid data');
                error.statusCode = 400; // Bad request
                throw error;
            } else if (currUserId === userId) {
                const error = new Error('Cannot follow yourself');
                error.statusCode = 400; // Bad request
                throw error;
            } else {
                
                const currUser = await this.userRepository.findById(currUserId);
                if (!currUser) {
                    const error = new Error('User doesn\'t exists');
                    error.statusCode = 404; // Not Found
                    throw error;
                }
                const otherUser = await this.userRepository.findById(userId);
                if (!otherUser) {
                    const error = new Error('User you want to unfollow doesn\'t exists');
                    error.statusCode = 404; // Not Found
                    throw error;
                }
                
                
                if (currUser.followings.includes(userId)) {
                    await this.userRepository.unFollow(userId, currUserId);
                    await this.userRepository.unFollowing(currUserId, userId);
                    return otherUser.username;
                } else {
                    const error = new Error('User is not part of users you follow');
                    error.statusCode = 404; // Not Found
                    throw error;
                }
            }

        } catch (err) {
            if (err.statusCode === 400 || err.statusCode === 404) {
                throw err;
            }
            const error = new Error('_id length is incorrect');
            error.statusCode = 422; // Unprocessable Content
            throw error;
        }
    }
}