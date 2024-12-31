import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { useMutation } from '../../../utils/client/api';
import { Comment } from '@prisma/client';
import { Textarea } from '../../form/Textarea';
import { Loader } from '../../Loader';
import { ToastContext } from '../../../providers/ToastProvider';
import { Input } from 'components/form/Input';
import { CommentHeading } from './CommentHeading';

export type HandleCommentProps = {
  postId: string;
  comment?: Comment;
  setEditing: Dispatch<SetStateAction<boolean>>;
  isAdmin?: boolean;
};

const HandleComment = ({
  postId,
  comment,
  setEditing,
  isAdmin,
}: HandleCommentProps) => {
  const [authorName, setAuthorName] = useState(comment?.authorName || '');
  const [content, setContent] = useState(comment?.content || '');
  const [isSaving, setSaving] = useState(false);

  const { showToast } = useContext(ToastContext);

  const { trigger: triggerCommentMutation } = useMutation(
    comment
      ? `/api/posts/${postId}/comments/${comment.id}`
      : `/api/posts/${postId}/comments`,
    `/api/posts/${postId}`,
  );

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const editedComment = {
      ...comment,
      authorName,
      content,
      postId,
    };
    try {
      await triggerCommentMutation({
        method: comment ? 'PATCH' : 'POST',
        body: editedComment,
      });
      if (!comment) {
        setAuthorName('');
        setContent('');
      }
    } catch (e) {
      showToast("Couldn't edit a comment", 'alert-error');
    }
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-4">
      <form className="grid gap-2 max-w-96 w-full" onSubmit={handleSave}>
        {comment ? (
          <CommentHeading comment={comment} />
        ) : (
          !isAdmin && (
            <Input
              placeholder="Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              id="comment-author-field"
            />
          )
        )}
        <Textarea
          placeholder="Markdown content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          id="comment-content-field"
        />
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            disabled={isSaving}
            data-testid="comment-submit"
          >
            {isSaving && <Loader />}
            Save
          </button>
          {comment && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HandleComment;
