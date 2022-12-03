import { SET_USER_DATA } from "../constants/User";

const initialState = {
  address: "",
  dob: "",
  email: "",
  fullName: "",
  id: "",
  identityNumber: "",
  internalEmail: "",
  isEmailVerified: false,
  isInternship: false,
  jobTitle: "",
  position: "",
  role: {
    permissions: []
  },
  startedWorkingAt: "",
  state: "",
  typeOfWork: "",
  username: "",
  wakaTimeConnected: false
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_USER_DATA:
      state = {
        ...state,
        ...action.payload,
        wakaTimeConnected: action.payload.wakaTimeId && action.payload.wakaTimeToken
      };

    default:
      return state;
  }
}

export default reducer;
