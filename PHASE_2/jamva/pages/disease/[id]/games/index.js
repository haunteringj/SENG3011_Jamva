import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
const index = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="gamesButtonContainer">
      <Link href={`/hangman/${id}`}>
        <button class="btn-easy custom-btn">Easy</button>
      </Link>
      <Link href={`/quizzes/${id}`}>
        <button class="btn-medium custom-btn">Medium</button>
      </Link>
      <Link href={`/crosswords/${id}`}>
        <button class="btn-hard custom-btn">Hard</button>
      </Link>
    </div>
  );
};

export default index;
