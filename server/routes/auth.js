const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
    console.log("A request about auth is coming.");
    next();
});

router.get("/testAPI", (req, res) => {
    return res.send("Connected to auth route.");
});

//* obtain all users in the system
router.get("/", async (req, res) => {
    try {
      let userFound = await User.find({})
      return res.send(userFound);
    } catch (e) {
      return res.status(501).send(e);
    }
  });

router.post("/register", async (req, res) => {
    // 確認註冊數據是否符合要求
    let { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // 確認信箱是否被註冊過
    //Note: "User" 取用自 models/user_models export 的 Model
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("This email has been registered.");

    // create a new user
    let { email, username, password, role } = req.body;
    let newUser = new User({ email, username, password, role });
    try {
        let savedUser = await newUser.save();
        return res.send({
            msg: "The user has been saved successfully.",
            savedUser, //savedUser 會是一個被 return 的 object，規格如 User Model
        });
    } catch (e) {
        return res.status(500).send("Cannot save the user.");
    }
});


router.post("/login", async (req, res) => {
   // 確認註冊數據是否符合要求
   let { error } = loginValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   // 確認信箱是否被註冊過
   //Note: "User" 取用自 models/user_models export 的 Model
   const foundUser = await User.findOne({ email: req.body.email });
   if (!foundUser) return res.status(401).send("Cannot find the user you asked.");

   foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    // cb 有兩個變數： cb(null, result)，result 是 isMatch 的結果
    if (isMatch) {
        // 製作 jwt
        // return res.send("teeeest")
        const tokenObject = { _id: foundUser._id, email: foundUser.email };
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
        return res.send ({
            msg: "Login Successfully.",
            token: "JWT " + token, //!這邊的 "JWT" 後面一定要空格
            user: foundUser,
        });
    } else {
        return res.status(401).send("Wrong password.");
    }
   });
})



module.exports = router;