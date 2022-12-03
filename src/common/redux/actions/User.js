import { SET_USER_DATA } from "../constants/User";
import store from "../store";

export const setUserData = (data) => {
  return store.dispatch({
    type: SET_USER_DATA,
    payload: data,
  })
}