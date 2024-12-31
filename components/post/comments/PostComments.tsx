import React, { useContext, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useMutation } from '../../../utils/client/api';
import { Comment } from '@prisma/client';
import { ConfirmationModal } from '../../ConfirmationModal';
import { ToastContext } from '../../../providers/ToastProvider';
import HandleComment from './HandleComment';
import { CommentHeading } from './CommentHeading';

export type PostCommentsProps = {
  postId: string;
  comments: Comment[];
  isAdmin?: boolean;
};

const PostComments = ({ postId, comments, isAdmin }: PostCommentsProps) => {
  const [editing, setEditing] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment>();

  const confirmationModalRef = useRef<HTMLDialogElement>(null);

  const { showToast } = useContext(ToastContext);

  const { trigger: triggerCommentMutation } = useMutation(
    `/api/posts/${postId}/comments/${selectedComment?.id || ''}`,
    `/api/posts/${postId}`,
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await triggerCommentMutation({ method: 'DELETE' });
    } catch (e) {
      showToast("Couldn't delete a comment", 'alert-error');
    }
    setEditing(false);
    setDeleting(false);
    confirmationModalRef.current?.close();
  };

  return (
    <div
      className="card p-4 border-gray-100 border-2 border-solid"
      data-testid="post-comments"
    >
      {!!comments.length && (
        <h3 className="text-md font-medium my-2">Comments</h3>
      )}
      <div className="grid gap-4">
        {comments.map((comment) =>
          editing && selectedComment?.id == comment.id ? (
            <HandleComment
              postId={postId}
              comment={selectedComment}
              setEditing={setEditing}
            />
          ) : (
            <div key={comment.id}>
              {comment.authorName && <CommentHeading comment={comment} />}
              <ReactMarkdown className="mt-1 prose prose-headings:mb-1 prose-p:my-1 prose-ul:mt-1 prose-ol:mt-1 prose-li:my-0">
                {comment.content || ''}
              </ReactMarkdown>
              <div className="flex gap-2 mt-2">
                {isAdmin && (
                  <>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedComment(comment);
                        setEditing(true);
                      }}
                      data-testid="edit-comment"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        setSelectedComment(comment);
                        confirmationModalRef.current?.showModal();
                      }}
                      data-testid="remove-comment"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ),
        )}
      </div>
      <h3 className="text-md font-medium mt-5 mb-2">Add comment</h3>
      <HandleComment
        postId={postId}
        setEditing={setEditing}
        isAdmin={isAdmin}
      />
      <ConfirmationModal
        ref={confirmationModalRef}
        title={`Are you sure you want to delete "${selectedComment?.content}" comment?`}
        message="This action cannot be undone."
        buttonLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PostComments;
