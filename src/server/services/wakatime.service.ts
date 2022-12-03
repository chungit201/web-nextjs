import {IWakaAuthRequestData, IWakaAuthResponse} from "../../waka";
import axios from "axios";
import qs from "qs";
import User from "../../server/models/user.model";
import mongoose from "mongoose";


export const connectWakaTime = async (code: string, userId: mongoose.Schema.Types.ObjectId) => {
  let authResponse : IWakaAuthResponse = {};
  try {
    const authRequestData : IWakaAuthRequestData = {
      client_id: process.env.WAKATIME_APP_ID,
      client_secret: process.env.WAKATIME_APP_SECRET,
      redirect_uri: process.env.WAKATIME_REDIRECT_URI,
      grant_type: 'authorization_code',
      code,
    };

    const response: any = await axios({
      method: "post",
      url: "https://wakatime.com/oauth/token",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(authRequestData)
    });
    authResponse = response.data;
  } catch (e) {
    throw new Error("Failed to authorize due to unknown reason.");
  }
  if (authResponse.access_token) {
    await User.updateOne({
      _id: userId
    }, {
      wakaTimeId: authResponse.uid,
      wakaTimeToken: authResponse.access_token,
      wakaTimeRefreshToken: authResponse.refresh_token
    });
    return true;
  } else throw new Error("Identifier is not valid.");
};

export const refreshWakaToken = async(refreshToken: string) => {
  let authResponse : IWakaAuthResponse = {};
  try {
    const authRequestData : IWakaAuthRequestData = {
      client_id: process.env.WAKATIME_APP_ID,
      client_secret: process.env.WAKATIME_APP_SECRET,
      redirect_uri: process.env.WAKATIME_REDIRECT_URI,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    const response: any = await axios({
      method: "post",
      url: "https://wakatime.com/oauth/token",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(authRequestData)
    });
    authResponse = response.data;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to authorize due to unknown reason.");
  }
  return authResponse;
}

export const getWakaSummary = async (start: string, end: string, accessToken: string) => {
  try {
    const {data} = await axios({
      method: "GET",
      url: "https://wakatime.com/api/v1/users/current/summaries",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        start: start,
        end: end,
      },
    });
    return data;
  } catch (e) {
    console.log(e);
    throw new Error("Unknown error.");
  }
}

export const getWakaStats = async (duration: string, accessToken: string) => {
  try {
    const {data} = await axios({
      method: "GET",
      url: "https://wakatime.com/api/v1/users/current/stats/" + duration,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
    return data;
  } catch (e) {
    console.log(e);
    throw new Error("Unknown error.");
  }
}
