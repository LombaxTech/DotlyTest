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

  if (user) router.push("/chats");

  // if (user) return <ChatPage />;

  if (!userLoading && !user)
    return (
      <div className="flex-1 flex flex-col gap-4 items-center pt-24">
        <img
          src="https://assets-global.website-files.com/6554e01bb9073d017c926a10/6556aac1a5d5337668a7438b_Dotly%20character.png"
          className="lg:w-48 w-40"
        />
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
