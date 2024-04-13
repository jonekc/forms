import { Image, Post, User } from '@prisma/client';

type PostWithAuthor = Post & { author: User | null; images: Image[] };

export type { PostWithAuthor };
