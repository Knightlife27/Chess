// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-DCI5gMWMchEuJgDfar2S4cCKTNtGBCk",
  authDomain: "chess-royale-9cab4.firebaseapp.com",
  projectId: "chess-royale-9cab4",
  storageBucket: "chess-royale-9cab4.appspot.com",
  messagingSenderId: "643147753744",
  appId: "1:643147753744:web:bced59718d696865f25d95",
  measurementId: "G-8MNYLS2GXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);