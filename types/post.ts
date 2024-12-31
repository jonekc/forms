import { Comment, Image, Post, User } from '@prisma/client';

type PostWithAuthor = Post & {
  author: User | null;
  images: Image[];
  comments: Comment[];
};

export type { PostWithAuthor };
