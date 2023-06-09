import axios from 'axios';
import queryString from 'query-string';
import { SupplyOrderInterface, SupplyOrderGetQueryInterface } from 'interfaces/supply-order';
import { GetQueryInterface } from '../../interfaces';

export const getSupplyOrders = async (query?: SupplyOrderGetQueryInterface) => {
  const response = await axios.get(`/api/supply-orders${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSupplyOrder = async (supplyOrder: SupplyOrderInterface) => {
  const response = await axios.post('/api/supply-orders', supplyOrder);
  return response.data;
};

export const updateSupplyOrderById = async (id: string, supplyOrder: SupplyOrderInterface) => {
  const response = await axios.put(`/api/supply-orders/${id}`, supplyOrder);
  return response.data;
};

export const getSupplyOrderById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/supply-orders/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSupplyOrderById = async (id: string) => {
  const response = await axios.delete(`/api/supply-orders/${id}`);
  return response.data;
};
