import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

export default function AllChats() {
  const router = useRouter();

  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState<any>([]);

  useEffect(() => {
    if (user) setChats(user.chats || []);
  }, [user]);

  const createNewChat = async () => {
    router.push(`/chats/new`);
  };

  if (user)
    return (
      <div className="flex justify-center p-10">
        <div className="flex flex-col gap-4 w-4/12">
          <h1 className="text-2xl font-bold text-center"> Chats</h1>

          {chats &&
            chats.map((chat: any) => {
              return (
                <Link key={chat.id} href={`/chats/${chat.id}`}>
                  <div className="p-2 border shadow-md">
                    <h1 className="">{chat.chatTitle}</h1>
                  </div>
                </Link>
              );
            })}

          <button className="btn" onClick={createNewChat}>
            Create new chat
          </button>
        </div>
      </div>
    );
}
