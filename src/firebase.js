import { initializeApp } from "firebase/app";
import { getAuth ,signOut} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLDNGbGU7OzKmN_CiGQW_ji0MnVq4nwwI",
  authDomain: "graduation-d22cd.firebaseapp.com",
  projectId: "graduation-d22cd",
  storageBucket: "graduation-d22cd.appspot.com",
  messagingSenderId: "1095540793819",
  appId: "1:1095540793819:web:2e4b1d2c3ec027f65007fe",
  measurementId: "G-FLRSHEGR7M"
};

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

// logout fun
export const logout = async () => {
  try {
    await signOut(auth);
    if (localStorage.getItem("isAuthenticated")=="true") {      
      localStorage.removeItem("isAuthenticated")
  }
  } catch (err) {
    console.error(err);
  }
};