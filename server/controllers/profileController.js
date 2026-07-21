const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    if (name) {
      await UserModel.updateProfile(req.user.id, { name });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password.' });
      }
      const user = await UserModel.findByEmail(req.user.email);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(req.user.id, hashed);
    }

    const updated = await UserModel.findById(req.user.id);
    res.json({ message: 'Profile updated.', user: updated });
  } catch (err) {
    next(err);
  }
};
