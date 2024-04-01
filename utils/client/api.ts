import { getUserToken } from './storage';

const fetcher = async (url: string) => {
  const headers = {
    Authorization: `Bearer ${getUserToken()}`,
  };

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data');
  }
  return await res.json();
};

export { fetcher };
