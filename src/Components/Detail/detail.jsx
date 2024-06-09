import "./detail.css"
import {useState} from "react"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore.jsx";
import { auth, db } from "../../lib/firebase.jsx";
import { useUserStore } from "../../lib/userStore.jsx";


const Detail = () => {
    const [open,setOpen]= useState(false);

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat()
  }
    return (
        <div className="detail" >
            <div className="detailHeader">
            <img src={user?.avatar || "./assets/avatar.png"} alt="" />
                <h3>{user?.username}</h3>
                <span>Lorem Ipsum dolar sit amet</span>
            </div>
            <div className="detailMiddle">
                <div className="detailmid">
                    <span >Chat Settings</span>
                    <img src="./assets/arrowDown.png" />
                </div>
                <div className="detailmid">
                    <span >Chat Settings</span>
                    <img src="./assets/arrowDown.png" />
                </div>
                <div className="detailmid">
                    <span >Privacy & Help</span>
                    <img src="./assets/arrowDown.png" />
                </div>
                <div className="detailmid">
                    <span >Shared Photos</span>
                    {open ? <img src="./assets/arrowUp.png" onClick={()=> setOpen(prev => !prev)} /> :
                    <img src="./assets/arrowDown.png" onClick={()=> setOpen(prev => !prev)} />}
                </div>
               {open && <>
               <div className="shared_photos">
                    <div className="sharedpic">
                    <img className="sharedimg" src="https://images.pexels.com/photos/5727623/pexels-photo-5727623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
                    <p >Photo_2024_02.png</p>
                   </div>
                    <img src="./assets/download.png" />
                </div>
                <div className="shared_photos">
                    <div className="sharedpic">
                    <img className="sharedimg" src="https://images.pexels.com/photos/5727623/pexels-photo-5727623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
                    <p >Photo_2024_02.png</p>
                   </div>
                    <img src="./assets/download.png" />
                </div>
                <div className="shared_photos">
                    <div className="sharedpic">
                    <img className="sharedimg" src="https://images.pexels.com/photos/5727623/pexels-photo-5727623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
                    <p >Photo_2024_02.png</p>
                   </div>
                    <img src="./assets/download.png" />
                </div>
                <div className="shared_photos">
                    <div className="sharedpic">
                    <img className="sharedimg" src="https://images.pexels.com/photos/5727623/pexels-photo-5727623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
                    <p >Photo_2024_02.png</p>
                   </div>
                    <img src="./assets/download.png" />
                </div>
                </>
                }
                <div className="detailmid">
                    <span >Shared Files</span>
                    {open ? <img src="./assets/arrowUp.png" onClick={()=> setOpen(prev => !prev)} /> :
                    <img src="./assets/arrowDown.png" onClick={()=> setOpen(prev => !prev)} />}
                </div>
            </div>
            <div className="detailFooter">
            <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}</button>
            <button className="logout"  onClick={handleLogout}>Log Out</button>

            </div>
        </div>
    )
}

export default Detail;