//======== FIREBASE ========//
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR3cY_Qn6ecTb8uJYofFB5zuhL8ujRknA",
  authDomain: "dados-de-teste-804a4.firebaseapp.com",
  projectId: "dados-de-teste-804a4",
  storageBucket: "dados-de-teste-804a4.firebasestorage.app",
  messagingSenderId: "236456253874",
  appId: "1:236456253874:web:7c5e84763f25822ded2cab",
  measurementId: "G-FZ8JMHMWYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);