import express from 'express';

const router = express.Router();

router.get('/health', (_req: express.Request, res: express.Response): void => {
  res.json({ status: 'ok' });
});

export default router; 