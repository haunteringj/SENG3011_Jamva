import { db } from "../lib/firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

export const addQuiz = async (quizData) => {
  console.log("HERE");
  const docRef = await addDoc(collection(db, "cities"), {
    name: "Tokyo",
    country: "Japan",
  });
  console.log("HERE");
  return response;
};
export const getAllQuiz = async () => {
  const quizCol = collection(db, "quizzes");
  const snapshot = await getDocs(quizCol);
  const quiz = snapshot.docs.map((doc) => doc.data());
  return quiz;
};
