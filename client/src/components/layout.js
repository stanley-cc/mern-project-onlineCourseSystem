import { Outlet } from "react-router-dom";
import Nav from "./nav_component";

const Layout = ({currentUser, setCurrentUser}) => {
  return (
    <>
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser}/>
      <Outlet />
    </>
  );
};

export default Layout;
