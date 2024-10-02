import passport from "passport";
import jwt, { ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const JWTStrategy = jwt.Strategy;

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        }
        catch (err) {
            return done(err)
        }
    }
    ))
}

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies.rojoCookieToken ?? null;
    }
    return token;
}

export default initializePassport;