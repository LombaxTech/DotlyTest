import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import React, {
  useContext,
  useRef,
  useState,
  Fragment,
  useEffect,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  updateDoc,
  doc,
  addDoc,
  collection,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getCurrentDateTimeString } from "@/helperFunctions";

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

type GenMode = "" | "captions" | "repurpose-content" | "content-ideation";

type Props = { id: string };

export default function ChatPage({ id }: Props) {
  const { user } = useContext(AuthContext);

  const [chat, setChat] = useState<any | null>(null);

  const [messageInput, setMessageInput] = useState<any>("");
  const [messages, setMessages] = useState<any>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [quickGenOpen, setQuickGenOpen] = useState<any>(false);
  const [quickGenMode, setQuickGenMode] = useState<GenMode>("");

  const newestMessageRef = useRef<any>(null);

  // get chat if exists
  useEffect(() => {
    if (user) {
      let currentChat = user?.chats?.find((c: any) => c.id === id);

      if (currentChat) {
        setChat(currentChat);
        setMessages(currentChat.messages);
      }
    }
  }, [user, id]);

  const sendMessage = async () => {
    setLoading(true);

    let newMessage = {
      role: "user",
      content: messageInput,
    };

    const initMessage = {
      role: "system",
      content: `You are Dotly, a social media sidekick that helps users with any questions or issues they have with social media. If a user asks you to generate captions or hashtags, you also casually add  on "#getdotly" without talking too much about it. The user you will be helping is called ${user.name} and has described themselves using the following words: "${user.about}"`,
    };

    try {
      if (messages.length === 0) {
        let messagesParam = [initMessage, newMessage];
        setMessages(messagesParam);

        let res = await axios.post(`${url}/api/get-completion`, {
          messages: messagesParam,
        });

        let receivedMessage = {
          role: "assistant",
          content: res.data.result,
        };

        setMessages((oldMessages: any) => [...oldMessages, receivedMessage]);

        const chatId = getCurrentDateTimeString();

        const newChat = {
          id: chatId,
          createdAt: new Date(),
          chatTitle: getCurrentDateTimeString(),
          messages: [initMessage, newMessage, receivedMessage],
        };
        setChat(newChat);

        await updateDoc(doc(db, "users", user.uid), {
          chats: arrayUnion(newChat),
        });
      } else if (messages.length > 0) {
        let messagesParam = [...messages, newMessage];
        setMessages(messagesParam);

        let res = await axios.post(`${url}/api/get-completion`, {
          messages: messagesParam,
        });

        let receivedMessage = {
          role: "assistant",
          content: res.data.result,
        };
        setMessages((oldMessages: any) => [...oldMessages, receivedMessage]);

        const updatedChats = user.chats.map((c: any) => {
          if (c.id !== chat.id) return c;

          if (c.id === chat.id)
            return {
              ...c,
              messages: [...c.messages, ...[newMessage, receivedMessage]],
            };
        });

        await updateDoc(doc(db, "users", user.uid), {
          chats: updatedChats,
        });
      }

      newestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      setMessageInput("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const logMessages = async () => {};

  if (user)
    return (
      <>
        <div className="flex-1 flex flex-col  overflow-hidden">
          {messages && messages.length === 0 ? (
            <div className="flex-1 flex flex-col gap-4 justify-center items-center">
              <div className="flex flex-col gap-8 items-center justify-center flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl font-medium">Ready To Post?</h1>
                  <img
                    src="https://assets-global.website-files.com/6554e01bb9073d017c926a10/6556aac1a5d5337668a7438b_Dotly%20character.png"
                    className="lg:w-16 w-32"
                  />
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                  <span
                    className={`py-4 px-4 cursor-pointer border-gray-700 border-2 font-bold`}
                    onClick={() => {
                      setQuickGenMode("captions");
                      setQuickGenOpen(true);
                    }}
                  >
                    Generate Captions
                  </span>
                  <span
                    className={`py-4 px-4 cursor-pointer border-gray-700 border-2 font-bold`}
                    onClick={() => {
                      setQuickGenMode("repurpose-content");
                      setQuickGenOpen(true);
                    }}
                  >
                    Repurpose Content
                  </span>
                  <span
                    className={`py-4 px-4 cursor-pointer border-gray-700 border-2 font-bold`}
                    onClick={() => {
                      setQuickGenMode("content-ideation");
                      setQuickGenOpen(true);
                    }}
                  >
                    Content Ideation
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:p-10 lg:px-32 p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
              {messages &&
                messages.map((message: any, i: any) => {
                  const messageFromUser = message.role === "user";

                  if (message?.show == false) return null;
                  if (message.role === "system") return null;
                  if (message.role === "user" || "assistant")
                    return (
                      <div
                        className="flex flex-col gap-1"
                        key={i}
                        onClick={() => console.log(message.role)}
                      >
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
          {messages && messages.length === 0 ? (
            <h1 className="text-center">Need help with something else?</h1>
          ) : null}

          <div className="p-4 lg:px-32 bg-white flex flex-col justify-center items-center gap-4">
            <div className="w-full flex-1 flex justify-center items-center">
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
            {messages && messages.length > 0 ? (
              <div className="w-full flex items-center justify-center gap-2">
                <span
                  className={`p-2 cursor-pointer border-gray-700 border-2 font-bold`}
                  onClick={() => {
                    setQuickGenMode("captions");
                    setQuickGenOpen(true);
                  }}
                >
                  Generate Captions
                </span>
                <span
                  className={`p-2 cursor-pointer border-gray-700 border-2 font-bold`}
                  onClick={() => {
                    setQuickGenMode("repurpose-content");
                    setQuickGenOpen(true);
                  }}
                >
                  Repurpose Content
                </span>
                <span
                  className={`p-2 cursor-pointer border-gray-700 border-2 font-bold`}
                  onClick={() => {
                    setQuickGenMode("content-ideation");
                    setQuickGenOpen(true);
                  }}
                >
                  Content Ideation
                </span>
              </div>
            ) : null}
            {/* <button className="btn" onClick={logMessages}>
            Log messages
          </button> */}
          </div>
        </div>
        <QuickGenerate
          quickGenMode={quickGenMode}
          quickGenOpen={quickGenOpen}
          setQuickGenOpen={setQuickGenOpen}
          existingMessages={messages}
          setMessages={setMessages}
          chat={chat}
          setChat={setChat}
        />
      </>
    );
}

function QuickGenerate({
  quickGenOpen,
  setQuickGenOpen,
  quickGenMode,
  existingMessages,
  setMessages,
  chat,
  setChat,
}: {
  quickGenOpen: any;
  setQuickGenOpen: any;
  quickGenMode: GenMode;
  existingMessages: any;
  setMessages: any;
  chat: any;
  setChat: any;
}) {
  const closeModal = () => setQuickGenOpen(false);
  const openModal = () => setQuickGenOpen(true);

  const { user } = useContext(AuthContext);

  const [contentToBeRepurposed, setContentToBeRepurposed] = useState<any>("");

  const [availableMinutes, setAvailableMinutes] = useState<any>("");
  const [happyToFilmSelf, setHappyToFilmSelf] = useState<"Yes" | "No">("No");
  const [happyToVoiceSelf, setHappyToVoiceSelf] = useState<"Yes" | "No">("No");

  const generate = async (mode: "captions" | "repurpose" | "ideation") => {
    // setLoading(true);

    const initMessage = {
      role: "system",
      content: `You are Dotly, a social media sidekick that helps users with any questions or issues they have with social media. If a user asks you to generate captions or hashtags, you also casually add  on "#getdotly" without talking too much about it. The user you will be helping is called ${user.name} and has described themselves using the following words: "${user.about}"`,
    };

    let newMessage: any;

    if (mode === "captions") {
      newMessage = {
        role: "user",
        content: `Generate captions for an image of a dog playing with a child in a garden`,
        show: false,
      };
    }

    if (mode === "repurpose") {
      newMessage = {
        role: "user",
        content: `Repurpose the following piece of content as a fresh piece of content for me to post: "${contentToBeRepurposed}"`,
        show: false,
      };
    }

    if (mode === "ideation") {
      newMessage = {
        role: "user",
        content: `I would like an idea to post on my social media. Am I happy to film myself? ${happyToFilmSelf}. Am I happy to do a voice over? ${happyToVoiceSelf}. How many minutes do I have available for this? ${availableMinutes}. Given this information and my background, please give me an idea.`,
        show: false,
      };
    }

    let messages: any = [];

    const chatExists = existingMessages.length > 0;

    if (!chatExists) {
      messages = [initMessage, newMessage];
    } else if (chatExists) {
      messages = [...existingMessages, newMessage];
    }

    try {
      let res = await axios.post(`${url}/api/get-completion`, {
        messages: messages.map(({ show, ...m }: { show: any }) => m),
      });

      let receivedMessage = {
        role: "assistant",
        content: res.data.result,
      };

      if (!chatExists) {
        const chatId = getCurrentDateTimeString();
        const newChat = {
          id: chatId,
          createdAt: new Date(),
          chatTitle: getCurrentDateTimeString(),
          messages: [initMessage, newMessage, receivedMessage],
        };
        setChat(newChat);
        await updateDoc(doc(db, "users", user.uid), {
          chats: arrayUnion(newChat),
        });
      } else {
        const updatedChats = user.chats.map((c: any) => {
          if (c.id !== chat.id) return c;

          if (c.id === chat.id)
            return {
              ...c,
              messages: [...c.messages, ...[newMessage, receivedMessage]],
            };
        });

        await updateDoc(doc(db, "users", user.uid), {
          chats: updatedChats,
        });
      }

      messages.push(receivedMessage);
      setMessages(messages);

      closeModal();

      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  };

  return (
    <Transition appear show={quickGenOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {quickGenMode === "captions" && (
                  <div className="flex flex-col gap-4">
                    <Dialog.Title
                      as="h3"
                      className="text-center text-lg font-medium leading-6 text-gray-900"
                    >
                      Generate Captions
                    </Dialog.Title>
                    <div className="mt-2 flex flex-col gap-2">
                      {/* <p className="text-sm text-gray-500 text-center">
                        Drop an image here to generate captions for it
                      </p> */}
                      <button className="btn self-center">Upload</button>

                      <div className="flex items-center gap-4 w-9/12 mx-auto">
                        <label className="w-3/12">Platform: </label>
                        <div className="border flex-1">
                          <select className="select w-full max-w-xs">
                            <option disabled selected>
                              Choose platform
                            </option>
                            <option>Instagram</option>
                            <option>Tiktok</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-9/12 mx-auto">
                        <label className="w-3/12">Hashtags: </label>
                        <div className="border flex-1">
                          <select className="select w-full max-w-xs">
                            <option disabled selected>
                              Yes/No
                            </option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-2">
                      <button
                        className="btn"
                        onClick={() => generate("captions")}
                      >
                        Generate
                      </button>
                      <button className="btn" onClick={closeModal}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {quickGenMode === "content-ideation" && (
                  <div className="flex flex-col gap-4">
                    <Dialog.Title
                      as="h3"
                      className="text-center text-lg font-medium leading-6 text-gray-900"
                    >
                      Content Ideation
                    </Dialog.Title>

                    <div className="flex items-center gap-4 w-9/12 mx-auto">
                      <label className="w-8/12">Happy to film yourself: </label>
                      <div className="border flex-1">
                        <select
                          className="select w-full max-w-xs"
                          value={happyToFilmSelf}
                          // @ts-ignore
                          onChange={(e) => setHappyToFilmSelf(e.target.value)}
                        >
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-9/12 mx-auto">
                      <label className="w-8/12">Happy to voiceover: </label>
                      <div className="border flex-1">
                        <select
                          className="select w-full max-w-xs"
                          value={happyToVoiceSelf}
                          // @ts-ignore
                          onChange={(e) => setHappyToVoiceSelf(e.target.value)}
                        >
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-9/12 mx-auto">
                      <label className="w-8/12">How long do you have: </label>
                      <div className="flex-1 flex justify-center items-center gap-2">
                        <input
                          type="text"
                          className="w-3/4 p-2 border"
                          value={availableMinutes}
                          onChange={(e) => setAvailableMinutes(e.target.value)}
                        />
                        <span>min</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center gap-2">
                      <button
                        className="btn"
                        onClick={() => generate("ideation")}
                      >
                        Ideate
                      </button>
                      <button className="btn" onClick={closeModal}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {quickGenMode === "repurpose-content" && (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Repurpose Content
                    </Dialog.Title>
                    <div className="mt-2">
                      <textarea
                        className="p-2 border w-full"
                        value={contentToBeRepurposed}
                        onChange={(e) =>
                          setContentToBeRepurposed(e.target.value)
                        }
                        placeholder="Enter the content you would like to be repurposed"
                      ></textarea>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        className="btn"
                        onClick={() => generate("repurpose")}
                      >
                        Repurpose Content
                      </button>
                      <button className="btn" onClick={closeModal}>
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
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
