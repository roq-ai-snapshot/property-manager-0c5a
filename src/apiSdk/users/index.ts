import axios from 'axios';
import queryString from 'query-string';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from '../../interfaces';

export const getUsers = async (query?: GetQueryInterface): Promise<UserInterface[]> => {
  const response = await axios.get(`/api/users${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const getUserById = async (id: string, query?: GetQueryInterface): Promise<UserInterface> => {
  const response = await axios.get(`/api/users/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};
