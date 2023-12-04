// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { arrayUnion, getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, getDoc } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8Os_SocOjMoasSpjrKlnhqzieQYHf2qM",
  authDomain: "waitingasaservice.firebaseapp.com",
  projectId: "waitingasaservice",
  storageBucket: "waitingasaservice.appspot.com",
  messagingSenderId: "462629550343",
  appId: "1:462629550343:web:75943909f9cdc972d86da2",
  measurementId: "G-SZSD4V8RB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;


export const updateUserProfile = async (userId, data, newComment) => {
  const userRef = doc(collection(db, "users"), userId);

  await setDoc(userRef, {
      surveyCompleted: true,
      surveyData: data,
      commentHistory: arrayUnion(newComment),
      uid: userId
  }, { merge: true });
};

export const getUserProfile = async (userId) => {
  const userRef = doc(collection(db, "users"), userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData;
  } else {
      // If the user document doesn't exist, assume the survey is not completed
      return null;
  }
};

export const getSurveyStatus = async (userId) => {
  const userRef = doc(collection(db, "users"), userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.surveyCompleted || false;
  } else {
      // If the user document doesn't exist, assume the survey is not completed
      return false;
  }
};

export const getSurveyResult = async (userId) => {
  const userRef = doc(collection(db, "users"), userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.surveyData|| false;
  } else {
      // If the user document doesn't exist, assume the survey is not completed
      return false;
  }
};