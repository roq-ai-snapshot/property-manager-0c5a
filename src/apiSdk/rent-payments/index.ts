import axios from 'axios';
import queryString from 'query-string';
import { RentPaymentInterface, RentPaymentGetQueryInterface } from 'interfaces/rent-payment';
import { GetQueryInterface } from '../../interfaces';

export const getRentPayments = async (query?: RentPaymentGetQueryInterface) => {
  const response = await axios.get(`/api/rent-payments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRentPayment = async (rentPayment: RentPaymentInterface) => {
  const response = await axios.post('/api/rent-payments', rentPayment);
  return response.data;
};

export const updateRentPaymentById = async (id: string, rentPayment: RentPaymentInterface) => {
  const response = await axios.put(`/api/rent-payments/${id}`, rentPayment);
  return response.data;
};

export const getRentPaymentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rent-payments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRentPaymentById = async (id: string) => {
  const response = await axios.delete(`/api/rent-payments/${id}`);
  return response.data;
};
