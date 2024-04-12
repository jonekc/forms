'use client';

import React, { ChangeEvent, useState } from 'react';
import { getUserToken } from '../utils/client/storage';

const Form: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getUserToken();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('published', published.toString());

    [...(files || [])].forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    fetch('/api/posts', {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  return (
    <>
      <h1>Create new post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <br />
          <input
            type="text"
            id="content"
            name="content"
            required
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="published">Published:</label>
          <input
            type="checkbox"
            id="published"
            name="published"
            onChange={(e) => {
              setPublished(e.target.checked);
            }}
          />
        </div>
        <br />
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
        <br />
        {[...(files || [])].map((file, index) => (
          <div key={index}>{file.name}</div>
        ))}
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Form;
