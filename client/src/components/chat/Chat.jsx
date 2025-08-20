// import { useContext, useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./chat.scss";
// import { AuthContext } from "../../context/AuthContext";
// import apiRequest from "../../lib/apiRequest";
// import { format } from "timeago.js";
// import { SocketContext } from "../../context/SocketContext";
// import { useNotificationStore } from "../../lib/notificationStore";

// function Chat({ chats }) {
//   const [chat, setChat] = useState(null);
//   const { currentUser } = useContext(AuthContext);
//   const { socket } = useContext(SocketContext);
//   const messageEndRef = useRef();
//   const decrease = useNotificationStore((state) => state.decrease);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const receiverFromNav = location.state?.receiver;

//   // Smooth scroll when messages append
//   useEffect(() => {
//     console.log("Receiver from nav:", receiverFromNav);
// console.log("Current user:", currentUser);
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat?.messages?.length]);

//   // Open a chat by id (ensure messages array present)
//   const handleOpenChat = async (id, receiver) => {
//     try {
//       const res = await apiRequest("/chats/" + id);
//       console.log("Chat creation response:", res.data);
//       if (!res.data.seenBy.includes(currentUser.id)) {
//         decrease();
//       }
//       const chatData = {
//         ...res.data,
//         receiver,
//         messages: res.data.messages || [],
//       };
//       setChat(chatData);
//     } catch (err) {
//       console.log("Error fetching chat:", err);
//     }
//   };

//   // Auto-open/create chat if we navigated with a receiver
//   useEffect(() => {
//     let cancelled = false;

//     const openOrCreate = async () => {
//       if (!receiverFromNav || !currentUser) return;

//       // 1) Try to open an existing chat from the provided list
//       const existing = chats?.find((c) => c?.receiver?.id === receiverFromNav.id);
//       if (existing) {
//         await handleOpenChat(existing.id, existing.receiver);
//         // Clear nav state so refresh doesn't retrigger
//         return navigate("/chat", { replace: true, state: {} });
//       }

//       // 2) Create (or get) the chat with that receiver
//       try {
//         // Your backend should return the chat object (create if not exists)
//         const res = await apiRequest.post("/chats", {
//           receiverId: receiverFromNav.id,
//         });

//         const chatData = {
//           ...res.data,
//           receiver: receiverFromNav,
//           messages: res.data.messages || [],
//         };
//         if (!cancelled) setChat(chatData);

//         // Clear state to avoid retrigger on re-renders
//         navigate("/chat", { replace: true, state: {} });
//       } catch (err) {
//         console.log("Error creating/opening chat:", err);
//       }
//     };

//     openOrCreate();
//     return () => {
//       cancelled = true;
//     };
//   }, [receiverFromNav, chats, currentUser, navigate]);

//   // Send a message
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const text = formData.get("text");
//     if (!text || !chat) return;

//     try {
//       const res = await apiRequest.post("/messages/" + chat.id, { text });

//       setChat((prev) => ({
//         ...prev,
//         messages: [...(prev?.messages || []), res.data],
//       }));
//       e.target.reset();

//       socket?.emit("sendMessage", {
//         receiverId: chat.receiver.id,
//         data: res.data,
//       });
//     } catch (err) {
//       console.log("Error sending message:", err);
//     }
//   };

//   // Socket: register a single listener; update state via functional set
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = async (data) => {
//       // Append only if the incoming message belongs to the open chat
//       setChat((prev) => {
//         if (!prev || prev.id !== data.chatId) return prev;
//         return { ...prev, messages: [...(prev.messages || []), data] };
//       });

//       // mark as read for this chat id, if applicable
//       try {
//         if (data.chatId) {
//           await apiRequest.put("/chats/read/" + data.chatId);
//         }
//       } catch (err) {
//         console.log("Error marking chat read:", err);
//       }
//     };

//     socket.on("getMessage", handleMessage);
//     return () => {
//       socket.off("getMessage", handleMessage);
//     };
//   }, [socket]);

//   return (
//     <div className="chat">
//       <div className="messages">
//         <h1>Messages</h1>
//         {chats?.map((c) => (
//           <div
//             className="message"
//             key={c.id}
//             style={{
//               backgroundColor:
//                 c.seenBy.includes(currentUser.id) || chat?.id === c.id
//                   ? "white"
//                   : "#fecd514e",
//             }}
//             onClick={() => handleOpenChat(c.id, c.receiver)}
//           >
//             <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
//             <span>{c.receiver.username}</span>
//             <p>{c.lastMessage}</p>
//           </div>
//         ))}
//       </div>

//       {chat && (
//         <div className="chatBox">
//           <div className="top">
//             <div className="user">
//               <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
//               {chat.receiver.username}
//             </div>
//             <span className="close" onClick={() => setChat(null)}>
//               X
//             </span>
//           </div>

//           <div className="center">
//             {(chat.messages || []).map((message) => (
//               <div
//                 className="chatMessage"
//                 key={message.id || message._id}
//                 style={{
//                   alignSelf:
//                     message.userId === currentUser.id ? "flex-end" : "flex-start",
//                   textAlign:
//                     message.userId === currentUser.id ? "right" : "left",
//                 }}
//               >
//                 <p>{message.text}</p>
//                 <span>{format(message.createdAt)}</span>
//               </div>
//             ))}
//             <div ref={messageEndRef} />
//           </div>

//           <form onSubmit={handleSubmit} className="bottom">
//             <textarea name="text" />
//             <button>Send</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Chat;
