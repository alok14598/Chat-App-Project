import { onAuthStateChanged } from "firebase/auth";
import "./App.css"
import Chat from "./Components/chat/chat.jsx";
import Detail from "./Components/Detail/detail.jsx";
import List from "./Components/list/list.jsx";
import Login from "./Components/LogIN/LogIn.jsx";
import Notification from "./Components/Notification/Notification.jsx";
import { useChatStore } from "./lib/chatStore.jsx";
import { useUserStore } from "./lib/userStore.jsx";
import { useEffect } from "react";
import { auth } from "./lib/firebase.jsx";

const App = () => {

  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;
 
  return (
    <div  className="App">

    <div className="container">
      {currentUser ? (
        <>
          <List />
         {chatId && <Chat />}
         {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
    </div>
  );
};

export default App;
