// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAsmn9YirXmq95VaK4IA20ksr3ctbloc9g",
    authDomain: "my-chat-app-2c070.firebaseapp.com",
    projectId: "my-chat-app-2c070",
    storageBucket: "my-chat-app-2c070.appspot.com",
    messagingSenderId: "477413371358",
    appId: "1:477413371358:web:e6dbd73fbc85a2f00f414f"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app)

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export { db, auth, provider }