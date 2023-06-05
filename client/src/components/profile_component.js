import { useState, useEffect } from "react";
import AuthService from "../services/auth_service";


const ProfileComponent = ({ currentUser, setCurrentUser }) => {

  // statelifting 後就不需要 useEffect 了
  // useEffect(() => {
  //   setCurrentUser(AuthService.getCurrentUser());
  // }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && <div>在獲取您的個人資料之前，您必須先登入。</div>}
      {currentUser && (
        <div>
          <h2>個人資訊</h2>

          <table className="table">
            <tbody>
              <tr>
                <td>
                  <strong>姓名：{currentUser.user.username}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>您的用戶 ID: {currentUser.user._id}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>您註冊的電子信箱: {currentUser.user.email}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>身份: {currentUser.user.role}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
