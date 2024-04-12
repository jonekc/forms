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
      <h1>Posts</h1>
      {posts?.map((post) => (
        <div key={post.id} className="post">
          <Post post={post} />
        </div>
      ))}
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
};

export default Posts;
