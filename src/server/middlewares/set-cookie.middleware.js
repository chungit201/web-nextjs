import {removeCookies, setCookies} from "cookies-next";

export const setTokenToCookies = async (req, res, tokens) => {
  const {access, refresh} = tokens;

  setCookies("access_token", access.token, {
    req, res,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  setCookies("refresh_token", refresh.token, {
    req, res,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

export const removeCookieFromToken = async (req, res) => {
  removeCookies("access_token", {req, res});
  removeCookies("refresh_token", {req, res});
}