import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'common/redux/reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
