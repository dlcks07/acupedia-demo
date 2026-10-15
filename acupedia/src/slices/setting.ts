import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  lastPageBeforeLogin: '',
  accessToken: ''
};
const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setLastPageBeforeLogin(state, action) {
      state.lastPageBeforeLogin = action.payload.lastPageBeforeLogin;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  }
});

export default settingSlice;
