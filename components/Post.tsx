import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Post as PostType } from '@prisma/client';

export type PostProps = {
  post: PostType;
};

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      {/* <small>By {authorName}</small> */}
      {post.published ? null : <small>Draft</small>}
      <ReactMarkdown children={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
