export const addQuizApi = async (values) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: values,
      };
  
      const resp = await fetch(
        `https://3.106.142.227/v1/quiz/`,
        requestOptions
      );
      return resp;
    } catch (error) {
      throw error;
    }
  };