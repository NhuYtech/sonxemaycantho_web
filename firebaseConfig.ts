import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCcn8S4zCL7f7JqXqofDm-8Cmdy2W2DT-k",
  databaseURL: "https://sonxemay-cantho-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
