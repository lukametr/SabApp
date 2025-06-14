import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response): Promise<void> => {
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

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'არასწორი ელ-ფოსტა ან პაროლი' });
      return;
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'არასწორი ელ-ფოსტა ან პაროლი' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'შეცდომა პროფილის მიღების დროს' });
  }
}; 