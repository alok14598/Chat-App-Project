import {  useEffect, useState } from "react";
import UserInfo from "./UserInfo/UserInfo.jsx";
import AddUser from "./addUser/addUser.jsx"
import "./list.css"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore.jsx";
import { useUserStore } from "../../lib/userStore.jsx";
import { db } from "../../lib/firebase.jsx";


const List = () => {

    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");
  
    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();
  
    useEffect(() => {
      const unSub = onSnapshot(
        doc(db, "userchats", currentUser.id),
        async (res) => {
          const items = res.data().chats;
  
          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
  
            const user = userDocSnap.data();
  
            return { ...item, user };
          });
  
          const chatData = await Promise.all(promises);
  
          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      );
  
      return () => {
        unSub();
      };
    }, [currentUser.id]);
  
    const handleSelect = async (chat) => {
      const userChats = chats.map((item) => {
        const { user, ...rest } = item;
        return rest;
      });
  
      const chatIndex = userChats.findIndex(
        (item) => item.chatId === chat.chatId
      );
  
      userChats[chatIndex].isSeen = true;
  
      const userChatsRef = doc(db, "userchats", currentUser.id);
  
      try {
        await updateDoc(userChatsRef, {
          chats: userChats,
        });
        changeChat(chat.chatId, chat.user);
      } catch (err) {
        console.log(err);
      }
    };
  
    const filteredChats = chats.filter((c) =>
      c.user.username.toLowerCase().includes(input.toLowerCase())
    );
    const [open,setOpen] =useState(false);

    return (
        <div className="list" >
            <UserInfo />
            <div className="searchItem"> 
                <div className="search">
                    <img src="./assets/search.png" className="searchImg"  />
                    <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
                </div>
                <img
          src={addMode ? "./assets/minus.png" : "./assets/plus.png"}
          alt=""

          onClick={() => setAddMode((prev) => !prev)}
        />
            </div>

            {filteredChats.map((chat) => (
            <div className="chatUser"  key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}>
            <img  className="avatar" src={
              chat.user.blocked.includes(currentUser.id)
                ? "./assets/avatar.png" 
                : chat.user.avatar || "./assets/avatar.png"
            } />
                <div className="chatUsers">
                    <span> {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}</span>
                    <p>{chat.lastMessage}</p>
                </div>
            </div>
        ))}
           
        {addMode && <AddUser />}
        </div>
    )
}

export default List;