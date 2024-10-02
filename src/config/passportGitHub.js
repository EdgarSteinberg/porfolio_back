import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../models/usersModels.js';

dotenv.config();

const initializePassportGitHub = () => {
    // App ID: 980512
    const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const SECRET_ID = process.env.GITHUB_SECRET_ID;
    const SECRET_KEY = process.env.SECRET_KEY;

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: SECRET_ID,
        callbackURL: 'http://localhost:8080/api/gitHub/githubcallback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);

            const email = profile._json.email || `${profile._json.login}@github.com`;

            let user = await userModel.findOne({ email: email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: profile._json.name,
                    age: 0,
                    email: email,
                    password: 'defaultPassword'
                };
                // Define 'result' here
                let result = await userModel.create(newUser);

                const token = jwt.sign({ _id: result._id, email: result.email, username: result.first_name }, SECRET_KEY, { expiresIn: '1h' });
                console.log('Token generado:', token);

                done(null, { user: result, token });
            } else {
                // Use 'user' directly if already exists
                const token = jwt.sign({ _id: user._id, email: user.email, username: user.first_name }, SECRET_KEY, { expiresIn: '1h' });
                console.log('Token generado:', token);

                done(null, { user, token });
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.user ? user.user._id : user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
}

export default initializePassportGitHub;
