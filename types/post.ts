import { Post, User } from '@prisma/client';

type PostWithAuthor = Post & { author: User | null };

export type { PostWithAuthor };
