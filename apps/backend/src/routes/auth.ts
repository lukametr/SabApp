import { Router } from 'express';

const router = Router();

// რეგისტრაციის მარშრუტი
router.post('/register', async (req, res) => {
    try {
        // TODO: დაამატე რეგისტრაციის ლოგიკა
        res.status(201).json({ message: 'რეგისტრაცია წარმატებით დასრულდა' });
    } catch (error) {
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
});

// ავტორიზაციის მარშრუტი
router.post('/login', async (req, res) => {
    try {
        // TODO: დაამატე ავტორიზაციის ლოგიკა
        res.status(200).json({ message: 'ავტორიზაცია წარმატებით დასრულდა' });
    } catch (error) {
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
});

export default router; 