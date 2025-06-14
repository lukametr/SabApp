import express from 'express';
import { Document } from '../models/Document';
import { authenticateToken } from '../middleware/auth';
import { IUser } from '../models/User';

const router = express.Router();

// დოკუმენტების სიის მიღება
router.get('/', authenticateToken, async (req, res) => {
  try {
    const documents = await Document.find({ userId: (req.user as IUser)?._id });
    return res.json(documents);
  } catch (error) {
    return res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// დოკუმენტის შექმნა
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, isFavorite, riskAssessment } = req.body;
    const document = new Document({
      userId: (req.user as IUser)?._id,
      title,
      content,
      isFavorite,
      riskAssessment
    });
    await document.save();
    return res.status(201).json(document);
  } catch (error) {
    return res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// დოკუმენტის მიღება ID-ით
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'დოკუმენტი ვერ მოიძებნა' });
    }
    if (document.userId.toString() !== (req.user as IUser)?._id?.toString()) {
      return res.status(403).json({ message: 'არ გაქვთ წვდომა ამ დოკუმენტზე' });
    }
    return res.json(document);
  } catch (error) {
    return res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// დოკუმენტის განახლება
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'დოკუმენტი ვერ მოიძებნა' });
    }
    if (document.userId.toString() !== (req.user as IUser)?._id?.toString()) {
      return res.status(403).json({ message: 'არ გაქვთ წვდომა ამ დოკუმენტზე' });
    }
    const { title, content, isFavorite, riskAssessment } = req.body;
    if (title) document.title = title;
    if (content) document.content = content;
    if (typeof isFavorite === 'boolean') document.isFavorite = isFavorite;
    if (riskAssessment) document.riskAssessment = riskAssessment;
    await document.save();
    return res.json(document);
  } catch (error) {
    return res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// დოკუმენტის წაშლა
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'დოკუმენტი ვერ მოიძებნა' });
    }
    if (document.userId.toString() !== (req.user as IUser)?._id?.toString()) {
      return res.status(403).json({ message: 'არ გაქვთ წვდომა ამ დოკუმენტზე' });
    }
    await document.deleteOne();
    return res.json({ message: 'დოკუმენტი წარმატებით წაიშალა' });
  } catch (error) {
    return res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

export default router; 