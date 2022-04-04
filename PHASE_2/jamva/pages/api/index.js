import { NextApiRequest, NextApiResponse } from "next";
import { addQuiz as addQuizFb } from "../../utils/db";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      console.log("post");
      await addQuiz(req, res);
      break;
    default:
      res.status(405).json({ status: false, message: "Method Not found" });
      break;
  }
};

const addQuiz = async (req, res) => {
  try {
    const quizData = { ...req.body };

    await addQuizFb(quizData);
    console.log("adding");
    return res
      .status(200)
      .json({ status: true, message: "Quiz added successfully..." });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong" });
  }
};
