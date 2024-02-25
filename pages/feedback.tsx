import { AuthContext } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";

export default function Feedback() {
  const { user } = useContext(AuthContext);

  const [feedbackText, setFeedbackText] = useState("");

  const [success, setSuccess] = useState<any>(false);
  const [error, setError] = useState<any>(false);

  const submitFeedback = async () => {
    setSuccess(false);
    setError(false);

    try {
      const newFeedback = {
        feedbackText,
        createdAt: new Date(),
        user: {
          id: user.uid,
          name: user.name,
        },
      };

      await addDoc(collection(db, "feedback"), newFeedback);

      await updateDoc(doc(db, "users", user.uid), {
        submittedFeedback: {
          lastSubmitted: new Date(),
        },
      });

      // todo: update user profile to show feedback has been submitted

      console.log("submitted feedback");

      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <div className="p-10 flex flex-col">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <textarea
        className="p-2 outline-none border-2"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      />

      <button className="btn" onClick={submitFeedback} disabled={!feedbackText}>
        Submit Feedback
      </button>
      {success && (
        <div className="bg-green-200 p-2 text-green-800">
          Thank you for your feedback!
        </div>
      )}
    </div>
  );
}
