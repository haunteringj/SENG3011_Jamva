import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCRU68lEwoKPiNCVpQTMgrfRNcs7r21uPw",
  authDomain: "jamva-real.firebaseapp.com",
  projectId: "jamva-real",
  storageBucket: "jamva-real.appspot.com",
  messagingSenderId: "746412855690",
  appId: "1:746412855690:web:0603bb26ad44615518f873",
  measurementId: "G-WF3E3CMXSX"
})

export const auth = app.auth();
export default app;