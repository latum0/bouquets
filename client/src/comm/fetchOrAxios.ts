import { FETCH } from '../constants/config';
import axios from 'axios';

export async function myFetch(url: string, options: {}) {
  if (FETCH) {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error('Error on fetch');
    }
    return res.json();
  }

  const res = await axios(url, options);
  return res.data;
}
