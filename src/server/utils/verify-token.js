import JWT from "jsonwebtoken";
import {jwt} from "server/config";
import {authService} from "server/services";
import {setCookies} from "cookies-next";
import {userService} from 'server/services'

export const verifyTokenFromCookies = (req, res, access_token, refresh_token) => {
  return new Promise(async resolve => {
    let sub, user;
    try {
      sub = await JWT.verify(access_token, jwt.secret)["sub"];
    } catch (err) {
      const data = await authService.refreshAuth(refresh_token);

      access_token = data.access.token;
      setCookies('access_token', access_token, {
        req, res,
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      });
      setCookies('refresh_token', data.refresh.token, {
        req, res,
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      });
      user = data.user;
      sub = user._id;
    }
    user = (!user) ? await userService.getUserByFilter({_id: sub}) : user;
    resolve( {sub, user, access_token});
  });
}