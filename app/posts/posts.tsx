'use client';

import React from 'react';
import useSWR from 'swr';
import Post from '../../components/Post';
import { fetcher } from '../../utils/client/api';
import { PostWithAuthor } from '../../types/post';

const Posts: React.FC = () => {
  const { data: postsResponse, error } = useSWR<PostWithAuthor[]>(
    '/api/posts',
    fetcher,
  );

  const posts = !error ? postsResponse : undefined;

  return (
    <>
      <h1 className="font-bold text-2xl my-4">Posts</h1>
      <div className="grid gap-3">
        {posts?.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </>
  );
};

export default Posts;
