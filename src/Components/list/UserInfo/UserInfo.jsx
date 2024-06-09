import { auth } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";
import "./UserInfo.css"

const UserInfo= () => {

    const { currentUser } = useUserStore();
    const handleLogout = () => {
        auth.signOut();
       
      }
    return (
        <div className="userinfo">
            <div className="leftuser">
            <img src={currentUser.avatar || "./avatar.png"} alt="" />
                <h3>{currentUser.username}</h3>
            </div>
            <div className="rightuser">
                <img src="./assets/more.png" />
                <img src="./assets/video.png" />
                <img src="./assets/edit.png" />
                <img onClick={handleLogout} src="https://static-00.iconduck.com/assets.00/logout-icon-2048x2046-yqonjwjv.png" />
            </div>
        </div>
    )
}

export default UserInfo;