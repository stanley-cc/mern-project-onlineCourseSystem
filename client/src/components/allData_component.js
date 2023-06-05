import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course_service";
import AuthService from "../services/auth_service";

const AllDataComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const [allUserData, setAllUserData] = useState(null);
  const [allCourseData, setAllCourseData] = useState(null);
  useEffect(() => {
    AuthService.getAllUsers()
      .then((data) => {
        console.log(data);
        setAllUserData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    CourseService.getAllCourses()
      .then((data) => {
        // console.log(data);
        setAllCourseData(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div>
      <div>
        <h1 style={{ width: "18rem", marginLeft: "1.5rem", paddingTop:"2rem" }}>全部使用者如下</h1>
        {allUserData &&
          allUserData.map((user) => (
            <div
              key={user._id}
              className="container py-4"
              style={{ width: "30rem", marginLeft: "0rem" }}
            >
              <div className="container-fluid">
                <p>使用者名稱: {user.username}</p>
                <p>使用者 ID: {user._id}</p>
                <p>使用者 email: {user.email}</p>
                <p>使用者身份: {user.role}</p>
              </div>
            </div>
          ))}
      </div>
      {!currentUser && (
        <div style={{ paddingLeft: "1.5rem", paddingBottom: "3rem" }}>
          <h1>登入以看到所有內容</h1>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && (
        <div>
          <h1 style={{ width: "18rem", marginLeft: "1.5rem" }}>全部課程如下</h1>
          {allCourseData &&
            allCourseData.map((course) => (
              <div
                key={course._id}
                className="container py-4"
                style={{ width: "30rem", marginLeft: "0rem" }}
              >
                <div className="container-fluid">
                  <h5 className="container-title">課程名稱：{course.title}</h5>
                  <p>課程 ID: {course._id}</p>
                  <p>講師名稱: {course.instructor.username}</p>
                  <p>講師 ID: {course.instructor._id}</p>
                  <p>註冊人數: {course.students.length}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AllDataComponent;
