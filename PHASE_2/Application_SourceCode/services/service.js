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
        `${process.env.NEXT_PUBLIC_API_URL}/v1/quiz/`,
        requestOptions
      );
      return resp;
    } catch (error) {
      throw error;
    }
  };