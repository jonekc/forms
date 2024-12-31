import { Fetcher } from 'swr';
import { TOKEN_KEY, getUserToken } from './storage';
import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration,
} from 'swr/mutation';
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

const handleUnauthorized = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  }
  console.log(error);
  throw new Error('An error occurred while fetching the data');
};

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
    handleUnauthorized(error);
  }
};

const mutateResponse: MutateResponse = async (
  url,
  { arg: { method, body, onUploadProgress } },
) => {
  const token = getUserToken();
  const headers = {
    ...(!(body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
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
    handleUnauthorized(error);
  }
};

const useMutation = (
  url: string,
  invalidateKey?: string,
  options?: SWRMutationConfiguration<any, any>,
) =>
  useSWRMutation(url, mutateResponse, {
    ...options,
    ...(invalidateKey && {
      onSuccess: () => {
        mutate(invalidateKey);
      },
    }),
  });

export { fetcher, useMutation };
