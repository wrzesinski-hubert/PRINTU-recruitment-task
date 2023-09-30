import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();

// Define the initial state
const initialState = {
  inputId: "",
  data: undefined,
};

// Create a Redux slice with reducers and actions
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInputId: (state, action: PayloadAction<string>) => {
      state.inputId = action.payload;
    },
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    fetchData: (state, action: PayloadAction<string>) => {},
  },
});

// Create the Redux store
const store = configureStore({
  reducer: appSlice.reducer,
  middleware: [sagaMiddleware],
});

// Export the store
export default store;
export type RootState = ReturnType<typeof store.getState>;

// Export actions
export const { setInputId, setData, fetchData } = appSlice.actions;
// Run the Redux Saga
sagaMiddleware.run(rootSaga);
