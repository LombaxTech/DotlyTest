import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { addDoc, collection, doc } from "firebase/firestore";
import React, { useContext, useState } from "react";

export default function ReportBug() {
  const { user } = useContext(AuthContext);

  const [bugInputText, setBugInputText] = useState("");

  const [success, setSuccess] = useState<any>(false);
  const [error, setError] = useState<any>(false);

  const sendReport = async () => {
    setSuccess(false);
    setError(false);

    try {
      console.log(bugInputText);
      const newBug = {
        bugText: bugInputText,
        createdAt: new Date(),
        reportedBy: {
          id: user.uid,
          name: user.name,
        },
      };

      await addDoc(collection(db, "bug-reports"), newBug);

      console.log("reported bug");

      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <div className="p-10 flex flex-col">
      <h1 className="text-2xl font-bold">Bug Report</h1>
      <textarea
        className="p-2 outline-none border-2"
        value={bugInputText}
        onChange={(e) => setBugInputText(e.target.value)}
      />
      <button className="btn" onClick={sendReport} disabled={!bugInputText}>
        Submit Report
      </button>
      {success && (
        <div className="bg-green-200 p-2 text-green-800">
          Reported Bug sucessfully
        </div>
      )}
    </div>
  );
}
