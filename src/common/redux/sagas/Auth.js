import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import {
	AUTH_TOKEN,
	SIGNIN,
	SIGNOUT,
	SIGNUP,
	SIGNIN_WITH_GOOGLE,
	SIGNIN_WITH_FACEBOOK
} from '../constants/Auth';
import {
	showAuthMessage,
	authenticated,
	signOutSuccess,
	signUpSuccess,
	signInWithGoogleAuthenticated,
	signInWithFacebookAuthenticated
} from "../actions/Auth";


export function* signInWithFBEmail() {
}

export function* signOut() {
}

export function* signUpWithFBEmail() {
}

export function* signInWithFBGoogle() {
}

export function* signInWithFacebook() {
}

export default function* rootSaga() {
  yield all([
		fork(signInWithFBEmail),
		fork(signOut),
		fork(signUpWithFBEmail),
		fork(signInWithFBGoogle),
		fork(signInWithFacebook)
  ]);
}
