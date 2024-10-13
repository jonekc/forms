import React, {
  CSSProperties,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from 'react';
import { PostWithAuthor } from '../../types/post';
import { fetcher, useMutation } from '../../utils/client/api';
import useSWR from 'swr';
import { Image as ImageType, User } from '@prisma/client';
import { Input } from '../form/Input';
import { Select } from '../form/Select';
import { Textarea } from '../form/Textarea';
import { Checkbox } from '../form/Checkbox';
import { Loader } from '../Loader';
import { PhotoModal } from '../PhotoModal';
import { getPostImageOriginalFilename } from '../../utils/client/post';
import { ToastContext } from '../../providers/ToastProvider';
import { Image } from 'components/Image';
import { EditImage } from './EditImage';
import { Progress } from 'components/Progress';

type SelectedImage = {
  url: string;
  title: string;
};

export type EditPostProps = {
  post: PostWithAuthor;
  setEditing: Dispatch<SetStateAction<boolean>>;
};

const EditPost = ({ post, setEditing }: EditPostProps) => {
  const [title, setTitle] = useState(post.title);
  const [authorId, setAuthorId] = useState(post.author?.id);
  const [content, setContent] = useState(post.content || '');
  const [published, setPublished] = useState(post.published || false);
  const [isSaving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedImage, setSelectedImage] = useState<SelectedImage>();
  const [existingImages, setExistingImages] = useState<
    (ImageType & {
      file: '' | File;
      title: string;
    })[]
  >(
    post.images.map((image) => ({
      ...image,
      title: getPostImageOriginalFilename(image.url) || '',
      file: '',
    })),
  );
  const [newImages, setNewImages] = useState<
    (SelectedImage & { file: File })[]
  >([]);
  const images = [
    ...existingImages.map((existingImage) => ({
      url: existingImage.url,
      title: existingImage.title,
    })),
    ...newImages.map((newImage) => ({
      url: newImage.url,
      title: newImage.title,
    })),
  ];

  const photoModalRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useContext(ToastContext);

  const { data: users } = useSWR<User[]>('/api/users', fetcher);
  const { trigger: triggerPostMutation } = useMutation(
    `/api/posts/${post.id}`,
    '/api/posts',
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('authorId', authorId || '');
      formData.append('content', content);
      formData.append('published', String(published));
      existingImages.forEach((existingImage) => {
        formData.append(`file-${existingImage.id}`, existingImage.file);
      });
      newImages.forEach((newImage, index) => {
        formData.append(`file${index + 1}`, newImage.file);
      });

      await triggerPostMutation({
        method: 'PATCH',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.progress;
          if (progress) {
            setUploadProgress(Math.round(progress * 100));
          }
        },
      });
    } catch (e) {
      showToast("Couldn't edit a post", 'alert-error');
    }
    setSaving(false);
    setEditing(false);
  };

  const handlePrev = () => {
    const item = images.find((image) => image.url === selectedImage?.url);
    if (item) {
      const index = images.indexOf(item);
      if (index > 0) {
        setSelectedImage(images[index - 1]);
      }
    }
  };
  const handleNext = () => {
    const item = images.find((image) => image.url === selectedImage?.url);
    if (item) {
      const index = images.indexOf(item);
      if (index < images.length - 1) {
        setSelectedImage(images[index + 1]);
      }
    }
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = e.target.files;
      setNewImages((prev) => [
        ...prev,
        ...[...(fileList || [])].map((file) => ({
          title: file.name,
          url: URL.createObjectURL(file),
          file,
        })),
      ]);
    }
  };

  const handleDeleteNewImage = (url: string) => {
    setNewImages((prev) => prev.filter((item) => item.url !== url));
  };

  const handleDeleteExistingImage = (id: string) => {
    setExistingImages((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex items-center gap-4">
      <div className="grid gap-2">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="post-title"
        />
        <Select
          value={authorId || ''}
          onChange={(e) => setAuthorId(e.target.value)}
          options={[
            { label: '', value: 'No author' },
            ...(users || []).map((user) => ({
              label: user.id,
              value: user.name || '',
            })),
          ]}
        />
        <Textarea
          placeholder="Markdown content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          id="post-content"
        />
        <Checkbox
          label="Published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
            disabled={isSaving}
            data-testid="post-submit"
          >
            {isSaving && <Loader />}
            Save
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              setEditing(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="flex items-end gap-1 flex-wrap min-h-48">
        {existingImages.map((image) => (
          <div className="grid gap-2" key={image.id}>
            <Image
              key={image.id}
              src={image.url}
              alt={image.title}
              width={160}
              height={90}
              onClick={() => {
                setSelectedImage({
                  url: image.url,
                  title: image.title,
                });
                photoModalRef.current?.showModal();
              }}
            />
            <div className="flex gap-2">
              <EditImage id={image.id} setExistingImages={setExistingImages} />
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  handleDeleteExistingImage(image.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {newImages.map((image) => (
          <div className="grid gap-2" key={image.url}>
            <Image
              src={image.url}
              alt={image.title}
              width={160}
              height={90}
              onClick={() => {
                setSelectedImage({ url: image.url, title: image.title });
                photoModalRef.current?.showModal();
              }}
            />
            <div className="flex justify-center">
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  handleDeleteNewImage(image.url);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <button
          className="btn btn-sm btn-primary mt-2"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          Select file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFilesChange}
          className="hidden"
        />
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div
            className="transform"
            style={
              {
                '--tw-translate-x': '8px',
                '--tw-translate-y': '8px',
              } as CSSProperties
            }
          >
            <Progress uploadProgress={uploadProgress} />
          </div>
        )}
      </div>
      <PhotoModal
        ref={photoModalRef}
        title={selectedImage?.title || ''}
        src={selectedImage?.url || ''}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </div>
  );
};

export default EditPost;
