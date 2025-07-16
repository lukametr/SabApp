import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(401).json({ error: 'Not authenticated' });
  const { organization, position } = req.body;
  // Call your backend API to update user profile
  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/users/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: session.user.email,
      organization,
      position,
    }),
  });
  if (!apiRes.ok) {
    return res.status(500).json({ error: 'Profile update failed' });
  }
  return res.status(200).json({ success: true });
}
