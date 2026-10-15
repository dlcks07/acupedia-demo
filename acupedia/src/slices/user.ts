import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  token: ''
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.name = action.payload.name;
      state.token = action.payload.token;
    }
  }
});

export default userSlice;
