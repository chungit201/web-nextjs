import {authService, tokenService, emailService} from '../services';
import httpStatus from "http-status";
import {cookies} from "server/middlewares";

export const login = async (req, res) => {
  const user = await authService.login(req.body);
  const tokens = await tokenService.generateAuthToken(user, req.body.remember);
  await cookies.setTokenToCookies(req, res, tokens);
  res.send({user, tokens});
};

export const logout = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  await cookies.removeCookieFromToken(req, res);
  res.status(httpStatus.OK).send();
};

export const refreshTokens = async (req, res) => {
  const result = await authService.refreshAuth(req.body.refreshToken);
  await cookies.setTokenToCookies(req, res, result);
  res.json(result);
};

export const sendMail = async (req, res) => {
  const {to, subject, content} = req.body;
  const data = await emailService.sendEmail(to, subject, content);
  res.send({...data});
};