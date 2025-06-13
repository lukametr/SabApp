import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // შევამოწმოთ არსებობს თუ არა მომხმარებელი
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'მომხმარებელი უკვე არსებობს' });
    }

    // შევქმნათ ახალი მომხმარებელი
    const user = new User({
      email,
      name,
      password,
    });

    await user.save();

    // შევქმნათ JWT ტოკენი
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'შეცდომა რეგისტრაციის დროს' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ვიპოვოთ მომხმარებელი
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'არასწორი ელ-ფოსტა ან პაროლი' });
    }

    // შევამოწმოთ პაროლი
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'არასწორი ელ-ფოსტა ან პაროლი' });
    }

    // შევქმნათ JWT ტოკენი
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'შეცდომა შესვლის დროს' });
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