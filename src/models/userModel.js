import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please provie a username."],
        unique: true,
    },
    email:{
        type: String,
        required: [true, "Please provide an email."],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Please provide a password."],
    },
    name:{
        type: String,
        required: [true, "Please provide your name."],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

const User= mongoose.models.users || mongoose.model('users', userSchema);  // .models is used to access the models that are already defined in mongoose.
//while .model is used to create a new model.
//mongoose.models.users || mongoose.model('users', userSchema) checks if the model already exists in memory to avoid recompiling it
// and if it does, it uses the existing model instead of creating a new one. As NextJs compiles the code on every request, this is important to avoid 
// recompiling the model every time. 

export default User;