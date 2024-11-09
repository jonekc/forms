import { Fetcher } from 'swr';
import { TOKEN_KEY, getUserToken } from './storage';
import useSWRMutation, { MutationFetcher } from 'swr/mutation';
import { mutate } from 'swr';
import axios, { AxiosProgressEvent } from 'axios';

type MutateResponse = MutationFetcher<
  any,
  string,
  {
    method: string;
    body?: any;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  }
>;

const fetcher: Fetcher<any, string> = async (url: string) => {
  const token = getUserToken();
  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    } else {
      console.log(error);
      throw new Error('An error occurred while fetching the data');
    }
  }
};

const mutateResponse: MutateResponse = async (
  url,
  { arg: { method, body, onUploadProgress } },
) => {
  const token = getUserToken();
  const headers = {
    ...(!(body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${getUserToken()}` }),
  };

  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body instanceof FormData ? body : JSON.stringify(body),
      onUploadProgress,
    });

    if (response.status >= 400) {
      throw new Error('An error occurred while fetching the data');
    }

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('An error occurred while fetching the data');
  }
};

const useMutation = (url: string, invalidateKey?: string) =>
  useSWRMutation(
    url,
    mutateResponse,
    invalidateKey
      ? {
          onSuccess: () => {
            mutate(invalidateKey);
          },
        }
      : undefined,
  );

export { fetcher, useMutation };
