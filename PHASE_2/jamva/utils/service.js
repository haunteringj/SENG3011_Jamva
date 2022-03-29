import axios from "axios";

export const addQuizApi = async (auth, values) => {
  try {
    const header = {
      "Content-Type": "application/json",
    };
    console.log("waiting Post");
    const resp = axios.post("/api/", values, { headers: header });
    return resp;
  } catch (error) {
    throw error;
  }
};
