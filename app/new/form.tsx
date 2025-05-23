'use client';

import React, { ChangeEvent, useContext, useState } from 'react';
import { Input } from '../../components/form/Input';
import { Checkbox } from '../../components/form/Checkbox';
import { Loader } from '../../components/Loader';
import { useMutation } from '../../utils/client/api';
import { ToastContext } from '../../providers/ToastProvider';
import { Progress } from 'components/Progress';
import { Textarea } from 'components/form/Textarea';
import ReactMarkdown from 'react-markdown';

const Form: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [filesInputKey, setFilesInputKey] = useState('');

  const [isUpdating, setUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { showToast } = useContext(ToastContext);

  const { trigger: triggerCreatePost } = useMutation('/api/posts');

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPublished(false);
    setFiles(null);
    setFilesInputKey(Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('published', published.toString());

    [...(files || [])].forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    try {
      await triggerCreatePost({
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.progress;
          if (progress) {
            setUploadProgress(Math.round(progress * 100));
          }
        },
      });
      showToast('Post successfully created', 'alert-success');
      resetForm();
    } catch (error) {
      showToast("Couldn't add a post", 'alert-error');
    }
    setUploadProgress(0);
    setUpdating(false);
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = e.target.files as FileList;
      setFiles(fileList);
    }
  };

  return (
    <>
      <h1 className="font-bold text-2xl my-4">Create new post</h1>
      <form onSubmit={handleSubmit} className="grid gap-2 prose">
        <Input
          placeholder="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          id="post-title-field"
        />
        <Textarea
          placeholder="Markdown content"
          required
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          id="post-content-field"
        />
        <ReactMarkdown className="prose prose-headings:mb-2 prose-p:my-2 prose-ul:mt-2 prose-ol:mt-2 prose-li:my-0">
          {content}
        </ReactMarkdown>
        <Checkbox
          label="published"
          checked={published}
          onChange={(e) => {
            setPublished(e.target.checked);
          }}
          id="post-published-field"
        />
        <div>
          <label htmlFor="images">Images: </label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFilesChange}
            key={filesInputKey}
            data-testid="post-file-field"
          />
        </div>
        {[...(files || [])].map((file, index) => (
          <div key={index} className="flex items-center gap-3">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-[80px] h-[45px] object-contain"
            />
            <span>{file.name}</span>
          </div>
        ))}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Progress uploadProgress={uploadProgress} />
        )}
        <div className="mt-3">
          <button
            className="btn btn-sm btn-primary"
            type="submit"
            disabled={isUpdating}
            data-testid="post-submit"
          >
            {isUpdating && <Loader />}
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
