import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyA6cl43TbVgH0DXPfRlPid3Rcu5KLQ9vrg",
  authDomain: "jamva-4e82e.firebaseapp.com",
  projectId: "jamva-4e82e",
  storageBucket: "jamva-4e82e.appspot.com",
  messagingSenderId: "759356849554",
  appId: "1:759356849554:web:960847269e2c2b00cb554b",
  measurementId: "G-RKS0ED1KER"
})

export const auth = app.auth();
export default app;