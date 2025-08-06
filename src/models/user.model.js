import mongoose, {Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        index: true // to ensure uniqueness in SEARCHING 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/ // simple email validation
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        index: true // to ensure uniqueness in SEARCHING
    },
    avatar: {
        type: String,// Cloudnary URL to the avatar image
        required: true
    },
    coverImage: {
        type: String
    },
    watchHistory:[{
        type: Schema.Types.ObjectId,
        ref: 'Video' // Reference to the Video model
    }],
    password: {
        type: String, // 📌 Hashed password ??? how ?? to match in db and login???
        required: [true, 'Password is required'],
        minlength: 6
    },
    refreshToken: {
        type: String // 📌 Used for JWT refresh token
    }

},
{
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

//pre and methods 
userSchema.pre("save",async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10); // Hash the password before saving
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) { // 📌why dont use callback fun () => {} and why we use function () here ?
    return await bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) throw new Error(err);
        return isMatch;
    })
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this.id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this.id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

export const User = mongoose.model('User', userSchema)