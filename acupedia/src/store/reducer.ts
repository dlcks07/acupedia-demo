import { combineReducers } from 'redux';
import settingSlice from 'slices/setting';
import userSlice from 'slices/user';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  setting: settingSlice.reducer
});

export default rootReducer;
