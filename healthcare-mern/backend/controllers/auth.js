import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './crud.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });

const send = (res, user, status = 200) =>
  res.status(status).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(409).json({ message: 'Email already registered' });
  }
  // First registered user becomes admin; everyone after is staff
  const role = (await User.countDocuments()) === 0 ? 'admin' : 'staff';
  const user = await User.create({ name, email, password, role });
  send(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  send(res, user);
});

export const me = (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ user: { id: _id, name, email, role } });
};
