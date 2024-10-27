'use client';

import React, { useContext } from 'react';
import useSWR from 'swr';
import Post from '../../components/post/Post';
import { fetcher } from '../../utils/client/api';
import { PostWithAuthor } from '../../types/post';
import { Loader } from '../../components/Loader';
import { OverlayLoader } from 'components/OverlayLoader';
import { AuthContext } from 'providers/AuthProvider';

const Posts: React.FC = () => {
  const {
    data: postsResponse,
    error,
    isLoading,
    isValidating,
  } = useSWR<PostWithAuthor[]>('/api/posts', fetcher);
  const { isAdmin } = useContext(AuthContext);

  const posts = !error ? postsResponse : undefined;

  return (
    <>
      <h1 className="font-bold text-2xl my-4">Posts</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-[75vh]">
          <Loader size="loading-md" />
        </div>
      ) : (
        <OverlayLoader isLoading={isValidating}>
          <div className="grid gap-3">
            {posts?.map((post) => (
              <Post key={post.id} post={post} isAdmin={isAdmin} />
            ))}
          </div>
        </OverlayLoader>
      )}
    </>
  );
};

export default Posts;
