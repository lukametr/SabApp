import express from 'express';
import { User, IUser } from '../models/User';
import { authenticateToken } from '../middleware/auth';
import * as bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });
    const token = (user as any).generateAuthToken();
    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'არასწორი ელ-ფოსტა ან პაროლი' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'არასწორი ელ-ფოსტა ან პაროლი' });
    }
    const token = (user as any).generateAuthToken();
    return res.json({ user, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById((req.user as IUser)?._id);
    if (!user) {
      return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router; 