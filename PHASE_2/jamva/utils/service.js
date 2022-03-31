import axios from "axios"
export const addQuizApi = async (values) => {
  try {
    console.log(values);
    const resp = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/quiz/create`,
      values
    );
    console.log(resp)
    return resp;
  } catch (error) {
    console.log(error)
    throw error;
  }
};
