import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./sagas";
import { projectDescriptionType } from "../types/types";

const sagaMiddleware = createSagaMiddleware();

const initialState: {
  inputID: string;
  data: projectDescriptionType | undefined;
  loading: boolean;
  invalidType: boolean;
  error?: { error: number; message: string };
} = {
  inputID: "",
  data: undefined,
  loading: false,
  invalidType: false,
  error: undefined,
};

const appSlice = createSlice({
  name: "canvasData",
  initialState,
  reducers: {
    setInputId: (state, action: PayloadAction<string>) => {
      state.inputID = action.payload;
    },
    setData: (state, action: PayloadAction<projectDescriptionType>) => {
      state.data = action.payload;
      state.invalidType = !action.payload.project.items.every(
        (item) => item.height > 0 && item.width > 0
      );
    },
    fetchData: (state, action: PayloadAction<string>) => {},
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (
      state,
      action: PayloadAction<{ error: number; message: string } | undefined>
    ) => {
      state.error = action.payload;
    },
  },
});

const store = configureStore({
  reducer: appSlice.reducer,
  middleware: [sagaMiddleware],
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const { setInputId, setData, fetchData, setLoading, setError } =
  appSlice.actions;

sagaMiddleware.run(rootSaga);
