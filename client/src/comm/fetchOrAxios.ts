import { FETCH } from '../constants/config';
import axios from 'axios';
export async function myFetch(url: string, options: any = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const finalOptions = { ...options, headers, credentials: 'include' };

  if (FETCH) {
    const res = await fetch(url, finalOptions);

    //  no Content
    if (res.status === 204) {
      return null;
    }

    if (!res.ok) {
      if (res.status === 401) console.warn('Unauthorized access');
      throw new Error('Error on fetch');
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
  }

  const res = await axios({
    url,
    method: options.method || 'GET',
    data: options.body ? JSON.parse(options.body) : undefined,
    headers,
    withCredentials: true,
  });

  return res.data;
}
