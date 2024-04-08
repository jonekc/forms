import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PostWithAuthor } from '../types/post';

export type PostProps = {
  post: PostWithAuthor;
};

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      {post.author && (
        <>
          <small>By {post.author.name}</small>
          <br />
        </>
      )}
      {post.published ? null : <small>Draft</small>}
      <ReactMarkdown children={post.content || ''} />
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
