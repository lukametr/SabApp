import express from 'express';
import { User, IUser } from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// მომხმარებლის რეგისტრაცია
router.post('/register', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'მომხმარებელი უკვე არსებობს' });
      return;
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName
    });

    await user.save();

    res.status(201).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// მომხმარებლის პროფილის მიღება
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById((req.user as IUser)?._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// მომხმარებლის პროფილის განახლება
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email, _id: { $ne: (req.user as IUser)?._id } });
    if (existingUser) {
      return res.status(400).json({ message: 'ელ-ფოსტა უკვე გამოყენებულია' });
    }
    const user = await User.findById((req.user as IUser)?._id);
    if (!user) {
      return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
    }
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// პაროლის შეცვლა
router.patch('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById((req.user as IUser)?._id);
    if (!user) {
      return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'მიმდინარე პაროლი არასწორია' });
    }
    user.password = newPassword;
    await user.save();
    return res.json({ message: 'პაროლი წარმატებით განახლდა' });
  } catch (error) {
    return res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

export default router; 