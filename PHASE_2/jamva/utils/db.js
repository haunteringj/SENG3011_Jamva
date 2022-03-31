
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
export const getAllQuiz = async () => {
  const quizCol = collection(db, "quizzes");
  const snapshot = await getDocs(quizCol);
  const quiz = snapshot.docs.map((doc) => doc.data());
  return quiz;
};
