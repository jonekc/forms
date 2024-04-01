import React from 'react';
import Layout from '../components/Layout';
import useSWR from 'swr';
import { Post as PostType } from '@prisma/client';
import Post from '../components/Post';
import { fetcher } from '../utils/client/api';

const Posts: React.FC = () => {
  const { data: postsResponse, error } = useSWR<PostType[]>(
    '/api/posts',
    fetcher,
  );

  const posts = !error ? postsResponse : undefined;

  return (
    <Layout>
      <div className="page">
        <h1>Posts</h1>
        <main>
          {posts?.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
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
    </Layout>
  );
};

export default Posts;
