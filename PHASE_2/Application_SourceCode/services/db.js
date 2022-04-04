import { db } from "../lib/firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

export const getAllQuiz = async () => {
  const quizCol = collection(db, "quizzes");
  const snapshot = await getDocs(quizCol);
  const quiz = snapshot.docs.map((doc) => doc.data());
  return quiz;
};

export const getSingleQuiz = async (quizId) => {
  const snapshot = await firebase
    .firestore()
    .collection("quiz")
    .doc(String(quizId))
    .get();
  const quizData = snapshot.exists ? JSON.stringify(snapshot.data()) : null;
  return quizData;
};