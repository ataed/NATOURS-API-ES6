import mongoose from 'mongoose';
const { Schema } = mongoose;

import bcrypt from 'bcryptjs';

import validator from 'validator';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name '],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['admin', 'lead-guide', 'guide', 'user'],
    default: 'user',
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    //check only on .save and .create!!!!!
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', async function (next) {
  //check if pw modified
  if (!this.isModified('password')) return next();

  //hash with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete passwordConfirm field from DB
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
