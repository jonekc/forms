'use client';

import { useParams } from 'next/navigation';
import React, { useContext } from 'react';
import useSWR from 'swr';
import Post from '../../../components/post/Post';
import { fetcher } from '../../../utils/client/api';
import { PostWithAuthor } from '../../../types/post';
import { Loader } from '../../../components/Loader';
import { AuthContext } from 'providers/AuthProvider';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { OverlayLoader } from 'components/OverlayLoader';

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: postResponse,
    error,
    isLoading,
    isValidating,
  } = useSWR<PostWithAuthor>(`/api/posts/${id}`, fetcher);
  const { isAdmin } = useContext(AuthContext);

  const post = !error ? postResponse : undefined;

  return (
    <div className="my-4">
      <Link href="/posts" className="flex items-center gap-2 mb-4 h-8">
        <ArrowLeftIcon className="h-6 w-6" />
        <h3 className="font-medium">Back</h3>
      </Link>
      {isLoading ? (
        <div className="flex justify-center items-center h-[75vh]">
          <Loader size="loading-md" />
        </div>
      ) : post ? (
        <OverlayLoader isLoading={isValidating}>
          <Post post={post} isSinglePost isAdmin={isAdmin} />
        </OverlayLoader>
      ) : (
        <h2 className="text-lg font-medium">Post not found</h2>
      )}
    </div>
  );
};

export default PostDetails;
