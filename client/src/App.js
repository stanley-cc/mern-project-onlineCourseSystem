import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/layout";
import HomeComponent from "./components/home_component";
import RegisterComponent from "./components/register_component";
import LoginComponent from "./components/login_component";
import ProfileComponent from "./components/profile_component";
import CourseComponent from "./components/course_component";
import PostCourseComponent from "./components/postCourse_component";
import AllDataComponent from "./components/allData_component";
import EnrollComponent from "./components/enroll_component";
import AuthService from "./services/auth_service";

function App() {
  //! currentUser 的 state 設定在這裡。每次開啟 App() 時都會去確認 localStorage 裡 AuthService.getCurrentUser() 的值並塞給 currentUser
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route index element={<HomeComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route
            path="/login"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfileComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/course"
            element={
              <CourseComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/postCourse"
            element={
              <PostCourseComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/enroll"
            element={
              <EnrollComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/allData"
            element={
              <AllDataComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
