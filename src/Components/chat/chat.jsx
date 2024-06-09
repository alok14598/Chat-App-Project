import { onSnapshot } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore.jsx";
import { useUserStore } from "../../lib/userStore.jsx";
import "./chat.css"
import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
  } from "firebase/firestore";
import {useEffect, useRef, useState} from "react";
import { db } from "../../lib/firebase.jsx";
import upload from "../../lib/upload.jsx";
import { format } from "timeago.js";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
    const [chat, setChat] = useState([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const endRef = useRef(null);





  useEffect(() => {
    
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
      console.log(res.data());
      console.log(chat);
    });

    return () => {
      unSub();
    };
  }, [chatId]);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);


  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally{
    setImg({
      file: null,
      url: "",
    });

    setText("");
    }
  }


    return (
        <div className="chat" >
            <div className="chatheader">
                <div className="chatheaderleft">
                <img src={user?.avatar || "./assets/avatar.png"} alt="" />
                    <div>
                        <h4> {user?.username}</h4>
                        <p>lorem ipsum dolar,sit amet</p>
                    </div>

                </div>
                <div className="chatheaderright">
                    <img  src="./assets/phone.png" />
                    <img  src="./assets/video.png" />
                    <img  src="./assets/info.png" />
                </div>

            </div>
            <div className="chats">
            {chat?.messages?.map((message) => (
          <div className={ message.senderId === currentUser?.id ? "message own" : "message" }
            key={message?.createAt} >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>{format(message.createdAt.toDate())}</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
            </div>
            <div className="chatfooter">
            <label htmlFor="file">
            <img src="./assets/img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
                <img src="./assets/camera.png" />
                <img src="./assets/mic.png" />
                <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

<div className="emoji">
          <img
            src="./assets/emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>

            </div>

        </div>
    )
}

export default Chat;