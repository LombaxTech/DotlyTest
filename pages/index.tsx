import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useEffect } from "react";

import { app, auth, db } from "@/firebase";
import { AuthContext } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import SetupAccount from "@/components/SetupAccount";
import ChatPage from "@/components/ChatPage";

export default function App() {
  const { user, userLoading } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    console.log("starting logs...");
    console.log(user);

    // if (!userLoading && !user) router.push("signup");
  }, [user, userLoading]);

  if (!userLoading && user?.setup == false) return <SetupAccount />;

  if (user) return <ChatPage />;

  if (!userLoading && !user)
    return (
      <div className="flex-1 flex flex-col items-center pt-36">
        <h1 className="lg:text-4xl lg:font-bold text-center text-3xl font-semibold">
          Sign in to give Dotly a go!
        </h1>
      </div>
    );

  return (
    <div className="">
      {user && (
        <div className="p-10">
          {user.email}
          {user.name}
        </div>
      )}
      {!user && <div>No user found</div>}
    </div>
  );
}
