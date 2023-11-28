// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/database"
import "firebase/compat/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUZ9UWeNlQ4er4XXJJKjabZ8iZNWeglZs",
  authDomain: "whatsapp-d8209.firebaseapp.com",
  projectId: "whatsapp-d8209",
  storageBucket: "whatsapp-d8209.appspot.com",
  messagingSenderId: "1073769760080",
  appId: "1:1073769760080:web:64b2aa7086fe54c80fd855"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;