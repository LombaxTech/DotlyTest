import { AuthContext } from "@/context/AuthContext";
import {
  db,
  // storage
} from "@/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";

export default function SetupAccount() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState<any>(user?.name || user?.displayName);
  const [about, setAbout] = useState<string>("");
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<any>(null);

  const [error, setError] = useState<any>(false);

  const finishProfileSetup = async () => {
    setError(false);

    if (!name || !about) {
      return setError(true);
    }

    let imageUrl;

    // todo: Upload image if image
    // if (file) {
    //   const fileRef = `profilePictures/${user.uid}/${file.name}`;

    //   const storageRef = ref(storage, fileRef);
    //   await uploadBytes(storageRef, file).then((snapshot) => {
    //     console.log("Uploaded a blob or file!");
    //   });

    //   imageUrl = await getDownloadURL(ref(storage, fileRef));
    // }

    const firestoreUser = {
      name,
      email: user.email,
      about,
      // profilePictureUrl: imageUrl,
    };

    // setFile(null);

    try {
      await setDoc(doc(db, "users", user.uid), firestoreUser);
      setUser({ ...user, ...firestoreUser, setup: true });
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center">
      <div className="flex flex-col gap-6 lg:w-4/12 w-full">
        <h1 className="font-bold text-xl">Tell us a bit about yourself</h1>
        <div className="flex flex-col gap-2">
          <label>Name: </label>
          <input
            type="text"
            className="border outline-none p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>About You: </label>
          <textarea
            className="border outline-none p-2"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell us a bit about yourself"
          />
        </div>
        <button className="btn btn-primary" onClick={finishProfileSetup}>
          Finish Profile Set Up
        </button>
        {error && (
          <div className="bg-red-200 p-2 text-red-800 text-center">
            Please fill in all fields
          </div>
        )}
      </div>
      {/* <div className="flex flex-col my-4">
        <label>Upload profile picture</label>
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
      </div> */}
    </div>
  );
}
