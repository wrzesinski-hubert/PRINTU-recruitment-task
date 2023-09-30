import {
  put,
  call,
  takeLatest,
  CallEffect,
  PutEffect,
} from "redux-saga/effects";
import { fetchData, setData, setInputId } from "./store";

// Function to make an asynchronous API call to get a random ID
async function getRandomIdAsync(): Promise<string> {
  // Replace this with your actual API call to get a random ID
  const response = await fetch("http://recruitment01.vercel.app/api/init");
  const data = await response.json();
  return data.id;
}

function* fetchAndSetData(
  action: ReturnType<typeof fetchData>
): Generator<
  | CallEffect<string>
  | PutEffect<{ payload: string; type: "app/setInputId" }>
  | CallEffect<{ payload: string; type: "app/fetchData" }>
  | CallEffect<Response>
  | PutEffect<{ payload: string; type: "app/setData" }>
  | any,
  void,
  any
> {
  const { payload: id } = action;
  if (id === "") {
    // If the input ID is empty, generate a random ID asynchronously
    const randomId = yield call(getRandomIdAsync);
    yield put(setInputId(randomId)); // Set the random ID in the input field
    yield put(fetchData(randomId)); // Trigger another fetchData action with the random ID
  } else {
    try {
      // Fetch data based on the provided ID
      const response = yield call(
        fetch,
        `http://recruitment01.vercel.app/api/project/${id}`
      );
      const data = yield response.json();
      yield put(setData(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

export function* rootSaga() {
  yield takeLatest(fetchData.type, fetchAndSetData);
}
