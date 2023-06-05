import axios from "axios";
const API_URL = "http://localhost:9000/api/course";

class CourseService {
  getToken() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return token;
  }

  post(title, description, price) {
    const token = this.getToken();
    return axios.post(
      API_URL,
      { title, description, price },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  //* 顯示所有課程
  getAllCourses() {
    const token = this.getToken();

    return axios.get(API_URL + "/", {
      headers: {
        Authorization: token,
      },
    });
  }

  //* 用學生 id 找到學生註冊的課程
  getEnrolledCourses(_id) {
    const token = this.getToken();

    return axios.get(API_URL + "/student/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  //* 用講師 id 找到講師擁有的課程
  getInstructorCourses(_id) {
    const token = this.getToken();

    return axios.get(API_URL + "/instructor/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  getCourseByName(name) {
    const token = this.getToken();

    return axios.get(API_URL + "/findbyName/" + name, {
      headers: {
        Authorization: token,
      },
    });
  }

  //* 用學生 id 註冊課程
  enroll(_id) {
    const token = this.getToken();
    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new CourseService();
