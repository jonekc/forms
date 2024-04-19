'use client';

import React, { ChangeEvent, useState } from 'react';
import { getUserToken } from '../utils/client/storage';
import { Input } from '../components/form/Input';
import { Checkbox } from '../components/form/Checkbox';
import { Loader } from '../components/Loader';

const Form: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUpdating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    const token = getUserToken();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('published', published.toString());

    [...(files || [])].forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    await fetch('/api/posts', {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
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
      <form onSubmit={handleSubmit} className="grid gap-2">
        <Input
          placeholder="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <Input
          placeholder="content"
          required
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <Checkbox
          label="published"
          checked={published}
          onChange={(e) => {
            setPublished(e.target.checked);
          }}
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
        <div className="mt-3">
          <button
            className="btn btn-sm btn-primary"
            type="submit"
            disabled={isUpdating}
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
