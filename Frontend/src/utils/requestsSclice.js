import { createSlice } from "@reduxjs/toolkit";

const requestsSclice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequest: (state, action) => {
      const newArray = state.filter((item) => item._id !== action.payload);
      return newArray;
    },
  },
});

export const { addRequests, removeRequest } = requestsSclice.actions;
export default requestsSclice.reducer;
