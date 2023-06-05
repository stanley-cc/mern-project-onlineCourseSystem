const { course } = require("../models");
const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route is getting a request.");
  next();
});

//* obtain all courses in the system
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec(); // review: .exec() 使其從物件變 promise
    return res.send(courseFound);
  } catch (e) {
    return res.status(501).send(e);
  }
});

//* 用 instructor ids 搜尋課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

//* 用 student id 搜尋課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    .populate([{ path: "instructor", select: ["username", "email"] }])
    .exec();
  return res.send(coursesFound);
});

//* 用 課程名稱 搜尋課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      // findOne 此處會給一個 object instead of an array 以至於後面無法 .map 所以要寫 find
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(501).send(e);
  }
});

//* 用 course id 搜尋課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(501).send(e);
  }
});

//* 新增課程
router.post("/", async (req, res) => {
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send(
        "Students are not allow to upload new courses. If you are an instructor, log in with your instructor's account >___^."
      );
  }

  let { title, description, price } = req.body; //這三個是一個課程要有的屬性
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send({
      msg: "the new course has been saved.",
      savedCourse,
    });
  } catch (e) {
    return res.status(500).send("Cannot creat a new course.");
  }
});

//* 讓學生透過 id 註冊課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    course.students.push(req.user._id);
    await course.save();
    return res.send("註冊成功。");
  } catch (e) {
    return res.send(e);
  }
});

//* 修改課程內容
router.patch("/:_id", async (req, res) => {
  // 確認註冊數據是否符合要求
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // 確認此課程存在
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res
        .status(400)
        .send("cannot find the course. cannot update the content.");
    }

    // 使用者必須是此課程的老師才能編輯此課程
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        msg: "the course has been updated",
        updatedCourse,
      });
    } else {
      return res
        .status(403)
        .send("Only the instructor can edit the course. Are you?");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.delete("/:_id", async (req, res) => {
  // 確認此課程存在
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res
        .status(400)
        .send("cannot find the course. cannot DELETE the content.");
    }

    // 使用者必須是此課程的老師才能刪除此課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("The course has been delete.");
    } else {
      return res
        .status(403)
        .send("Only the instructor can delete the course. Are you?");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
