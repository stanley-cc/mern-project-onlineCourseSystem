const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 50,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: true,
    },
    data: {
        type: Date,
        default: Date.now,
    },
});

// instance methods
userSchema.methods.isStudent = function () {
    return this.role == "student";
};

userSchema.methods.isInstructor = function () {
    return this.role == "instructor";
};

// cd 的內容是啥會在 auth 那邊實際引用時再把 callback function 定義出來 
userSchema.methods.comparePassword = async function(password, cb) {
        let result; 
        try {
            result = await bcrypt.compare(password, this.password);
            return cb(null, result); //result 的結果是 true or false
        } catch (e) {
            return cb(e, result);   
        }
    };

//mongoose middlewares
// 若使用者為新用戶或正在更改密碼，則將密碼進行雜湊處理
userSchema.pre("save", async function (next) {
    // this represent the document in mongoDB
    if (this.isNew || this.isModified("password")) {
        const hashValue = await bcrypt.hash(this.password, 10);
        this.password = hashValue;
    }
    next();
});

module.exports = mongoose.model("User", userSchema);
