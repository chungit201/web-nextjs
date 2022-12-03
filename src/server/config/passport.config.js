import {Strategy as JwtStrategy} from 'passport-jwt';
import config from 'server/config';
import {tokenTypes} from 'server/config/tokens.config';
import {User} from 'server/models';
import {getCookie} from "cookies-next";

const tokenFromCookieExtractor = (req, res) => {
  let jwt;
  if (req.cookies && req.cookies.access_token) {
    jwt = getCookie("access_token", {req, res});
  } else if (req.headers && req.headers.authorization) {
    jwt = req.headers.authorization.slice("Bearer ".length);
  } else if (req.body && req.body.access_token) {
    jwt = req.body.access_token;
  }
  return jwt;
}

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: tokenFromCookieExtractor,
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findOne({_id: payload.sub}).populate("role");

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export {
  jwtStrategy,
};
