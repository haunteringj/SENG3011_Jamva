import axios from "axios";
export const addQuizApi = async (values) => {
  try {
    console.log(values);
    const resp = await axios.post(
      `https://3.106.142.227/v1/quiz/create`,
      values
    );
    console.log(resp);
    return resp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const addAnswerApi = async (quizId, values) => {
  try {
    const header = {
      "Content-Type": "application/json",
    };
    console.log("ADDED", values);
    const resp = await axios.post(
      `https://3.106.142.227/v1/quiz/${quizId}/answer`,
      {
        questions: values,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { headers: header }
    );
    return resp;
  } catch (error) {
    throw error;
  }
};

