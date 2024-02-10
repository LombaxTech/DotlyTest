import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";

const url = process.env.NEXT_PUBLIC_FRONTEND_URL;

const LotsOfMessages = () => (
  <>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
    <h1 className="my-4">Test message</h1>
  </>
);

export default function ChatPage() {
  const { user } = useContext(AuthContext);

  const [messageInput, setMessageInput] = useState<any>("");
  const [messages, setMessages] = useState<any>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const newestMessageRef = useRef<any>(null);

  const sendMessage = async () => {
    setLoading(true);
    console.log(messageInput);

    const initMessage = {
      role: "system",
      content: `You are Dotly, a social media sidekick that helps users with any questions or issues they have with social media. The user you will be helping is called ${user.name} and has described themselves using the following words: "${user.about}"`,
    };

    let messagesParam = [initMessage];
    if (messages) {
      messagesParam = [initMessage, ...messages];
    }

    let newMessage = {
      role: "user",
      content: messageInput,
    };

    setMessages((oldMessages: any) => [...oldMessages, newMessage]);
    messagesParam = [...messagesParam, newMessage];

    console.log(messagesParam);

    try {
      let res = await axios.post(`${url}/api/get-completion`, {
        messages: messagesParam,
      });

      let receivedMessage = {
        role: "assistant",
        content: res.data.result,
      };

      setMessages((oldMessages: any) => [...oldMessages, receivedMessage]);
      newestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      setMessageInput("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (user)
    return (
      <div className="flex-1 flex flex-col  overflow-hidden">
        {messages && messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <h1 className="text-xl font-medium">Ask away!</h1>
          </div>
        ) : (
          <div className="lg:p-10 lg:px-32 p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
            {messages &&
              messages.map((message: any) => {
                const messageFromUser = message.role === "user";

                return (
                  <div className="flex flex-col gap-1">
                    <span className="font-thin text-sm">
                      {messageFromUser ? "You" : "Dotly"}
                    </span>
                    <div
                      className={`p-2 rounded-md w-fit ${
                        messageFromUser ? "bg-gray-200" : "bg-yellow-300"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}
            <div className="" ref={newestMessageRef}></div>
          </div>
        )}
        <div className="p-4 lg:px-32 bg-white flex justify-center items-center">
          <input
            type="text"
            className="p-2 border flex-1"
            placeholder="Enter your message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            className="btn btn-primary px-16"
            disabled={loading}
            onClick={sendMessage}
          >
            {loading ? "Sending Message" : "Send"}
          </button>
        </div>
      </div>
    );
}

// export default function ChatPage() {
//   return (
//     <div className="flex-1 flex overflow-hidden">
//       {/* CHATS */}
//       <div className="flex-1 flex flex-col max-w-[300px] bg-gray-500 overflow-y-auto">
//         {/* <LotsOfMessages /> */}
//       </div>

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <div className="flex-1 flex flex-col overflow-y-auto bg-gray-300">
//           <LotsOfMessages />
//         </div>
//         <div className="bg-gray-200 flex items-center border-t">
//           <input
//             type="text"
//             className="flex-1 p-4 outline-none "
//             placeholder="Type your message"
//           />
//           <button className="btn px-16">Send</button>
//         </div>
//       </div>
//     </div>
//   );
// }
