import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsvJ_hO96vHUzCAoIhOkmtThKfoT2UUHE",
  authDomain: "mycursorqr.firebaseapp.com",
  projectId: "mycursorqr",
  storageBucket: "mycursorqr.appspot.com",
  messagingSenderId: "211821711495",
  appId: "1:211821711495:web:6094b2582a7f97c3bf6822",
  measurementId: "G-2K822VCNH0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

googleProvider.setCustomParameters({
  prompt: 'select_account'
}); 