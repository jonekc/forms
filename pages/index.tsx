import React, { useState } from 'react';
import Layout from '../components/Layout';

const Form: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content, published }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <Layout>
      <div className="page">
        <h1>Create new post</h1>
        <main>
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
            <button type="submit">Submit</button>
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default Form;
