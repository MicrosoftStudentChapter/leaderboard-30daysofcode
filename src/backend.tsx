// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Required for side-effects
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwXVR38DQ6j_R6JIrvsGgkTIPWefIDWcM",
  authDomain: "thirty-days-of-code.firebaseapp.com",
  projectId: "thirty-days-of-code",
  storageBucket: "thirty-days-of-code.appspot.com",
  messagingSenderId: "287658274605",
  appId: "1:287658274605:web:23fad4cae4bf86351aeda4",
  measurementId: "G-5S7MYF8TW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;