import { AuthContext } from "@/context/AuthContext";
import { db, storage } from "@/firebase";
import { addDoc, collection, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";

export default function ReportBug() {
  const { user } = useContext(AuthContext);

  const [bugInputText, setBugInputText] = useState("");

  const [success, setSuccess] = useState<any>(false);
  const [error, setError] = useState<any>(false);

  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<any>(null);

  const sendReport = async () => {
    setSuccess(false);
    setError(false);

    console.log("here is the file");
    console.log(file);

    try {
      let imageUrl;

      // Upload image if image
      if (file) {
        const fileRef = `bugReports/${user.uid}/${file.name}`;

        const storageRef = ref(storage, fileRef);
        await uploadBytes(storageRef, file).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });

        imageUrl = await getDownloadURL(ref(storage, fileRef));
      }

      console.log(bugInputText);
      const newBug = {
        bugText: bugInputText,
        createdAt: new Date(),
        reportedBy: {
          id: user.uid,
          name: user.name,
        },
        ...(imageUrl && { imageUrl }),
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

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e: any) => setFile(e.target.files[0])}
        // style={{ display: "none" }}
      />
      {file && (
        <div className="relative">
          <img src={URL.createObjectURL(file)} width="100" />
          <div className="cursor-pointer" onClick={() => setFile(null)}>
            Delete
          </div>
        </div>
      )}

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
