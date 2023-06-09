import axios from 'axios';
import queryString from 'query-string';
import { PropertyInterface, PropertyGetQueryInterface } from 'interfaces/property';
import { GetQueryInterface } from '../../interfaces';

export const getProperties = async (query?: PropertyGetQueryInterface) => {
  const response = await axios.get(`/api/properties${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createProperty = async (property: PropertyInterface) => {
  const response = await axios.post('/api/properties', property);
  return response.data;
};

export const updatePropertyById = async (id: string, property: PropertyInterface) => {
  const response = await axios.put(`/api/properties/${id}`, property);
  return response.data;
};

export const getPropertyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/properties/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePropertyById = async (id: string) => {
  const response = await axios.delete(`/api/properties/${id}`);
  return response.data;
};
