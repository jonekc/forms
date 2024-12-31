import { Comment } from '@prisma/client';

const CommentHeading = ({ comment }: { comment: Comment }) => (
  <div>
    <small>By {comment.authorName} </small>
    <small>{new Date(comment.updatedAt).toLocaleString()}</small>
  </div>
);

export { CommentHeading };
