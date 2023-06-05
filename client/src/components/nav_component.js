import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import { userNavigate } from "react-router-dom";
import AuthService from "../services/auth_service";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  // const navigate = useNavigate(); 下面有 to="/"了
  const handleLogout = () => {
    AuthService.logout(); //empty localStorage
    window.alert("登出成功，回首頁。");
    setCurrentUser(null);
  };

  // 會根據 currentUser 的情形決定要出現哪些項目
  return (
    <div>
      <nav>
        <nav className="navbar navbar-expand -lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    首頁
                  </Link>
                </li>

                {/* 如果有 currentUser 的話這段就不會出現 */}
                {!currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      註冊會員
                    </Link>
                  </li>
                )}

                {!currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      會員登入
                    </Link>
                  </li>
                )}

                {currentUser && (
                  <li onClick={handleLogout} className="nav-item">
                    <Link className="nav-link" to="/">
                      登出
                    </Link>
                  </li>
                )}

                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      個人頁面
                    </Link>
                  </li>
                )}

                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/course">
                      課程頁面
                    </Link>
                  </li>
                )}

                {currentUser && currentUser.user.role == "instructor" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/postCourse">
                      新增課程
                    </Link>
                  </li>
                )}
                {currentUser && currentUser.user.role == "student" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/enroll">
                      註冊課程
                    </Link>
                  </li>
                )}
                {(
                  <li className="nav-item">
                    <Link className="nav-link" to="/allData">
                      All Data
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </div>
  );
};

export default NavComponent;
