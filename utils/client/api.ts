import { Fetcher } from 'swr';
import { TOKEN_KEY, getUserToken } from './storage';
import useSWRMutation, { MutationFetcher } from 'swr/mutation';

type MutateResponse = MutationFetcher<
  any,
  string,
  { method: string; body?: any }
>;

const fetcher: Fetcher<any, string> = async (url: string) => {
  const headers = {
    Authorization: `Bearer ${getUserToken()}`,
  };

  const res = await fetch(url, { headers });
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  }
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data');
  }
  return await res.json();
};

const mutateResponse: MutateResponse = async (
  url,
  { arg: { method, body } },
) => {
  const token = getUserToken();
  const headers = {
    ...(!(body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${getUserToken()}` }),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

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

const useMutation = (url: string) => useSWRMutation(url, mutateResponse);

export { fetcher, useMutation };
