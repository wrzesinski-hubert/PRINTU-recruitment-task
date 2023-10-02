import {
  put,
  call,
  takeLatest,
  CallEffect,
  PutEffect,
} from "redux-saga/effects";
import { fetchData, setData, setError, setInputId, setLoading } from "./store";

async function getRandomIdAsync(): Promise<string> {
  const response = await fetch("http://recruitment01.vercel.app/api/init");
  const data = await response.json();
  return data.id;
}

function* fetchAndSetData(
  action: ReturnType<typeof fetchData>
): Generator<CallEffect | PutEffect, void, any> {
  yield put(setLoading(true));
  yield put(setError(undefined));
  const { payload: id } = action;
  if (id === "") {
    const randomId = yield call(getRandomIdAsync);
    yield put(setInputId(randomId));
    yield put(fetchData(randomId));
  } else {
    try {
      const response = yield call(
        fetch,
        `http://recruitment01.vercel.app/api/project/${id}`
      );
      const data = yield response.json();
      response.ok ? yield put(setData(data)) : yield put(setError(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  yield put(setLoading(false));
}

export function* rootSaga() {
  yield takeLatest(fetchData.type, fetchAndSetData);
}
