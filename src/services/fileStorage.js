import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/data';

const request = async (method, data) => {
  try {
    const response = await axios({
      url: API_URL,
      method,
      data,
      timeout: 2500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const fileStorage = {
  getData: async () => request('get'),
  putData: async (data) => request('put', data),
  patchData: async (data) => request('patch', data),
};

