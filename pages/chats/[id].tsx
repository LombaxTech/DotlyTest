import ChatPage from "@/components/ChatPage";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Chat() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log("here is the id");
    console.log(id);
  }, [id]);

  if (id) return <ChatPage id={id as string} />;

  return <div>Chat</div>;
}
