import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the schema for the user model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['User', 'Administrator'],
      default: 'User'
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
