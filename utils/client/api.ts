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

const mutateResponse = async (url: string, method: string, body?: any) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getUserToken()}`,
  };

  const res = await fetch(url, { method, headers, body: JSON.stringify(body) });

  if (!res.ok) {
    throw new Error('An error occurred while fetching the data');
  }
  let json: any = null;
  try {
    json = await res.json();
  } catch (e) {
    console.log(e);
  }
  return json;
};

export { fetcher, mutateResponse };
