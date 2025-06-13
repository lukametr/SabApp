import { z } from 'zod';

export const documentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'სათაური სავალდებულოა'),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: z.enum(['draft', 'published', 'archived']),
  authorId: z.string().uuid(),
  tags: z.array(z.string()).default([]),
});

export type Document = z.infer<typeof documentSchema>;

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('არასწორი ელ-ფოსტის ფორმატი'),
  name: z.string().min(2, 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს'),
  role: z.enum(['admin', 'editor', 'viewer']),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>; 