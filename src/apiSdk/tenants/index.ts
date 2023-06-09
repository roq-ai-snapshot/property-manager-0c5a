import axios from 'axios';
import queryString from 'query-string';
import { TenantInterface, TenantGetQueryInterface } from 'interfaces/tenant';
import { GetQueryInterface } from '../../interfaces';

export const getTenants = async (query?: TenantGetQueryInterface) => {
  const response = await axios.get(`/api/tenants${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTenant = async (tenant: TenantInterface) => {
  const response = await axios.post('/api/tenants', tenant);
  return response.data;
};

export const updateTenantById = async (id: string, tenant: TenantInterface) => {
  const response = await axios.put(`/api/tenants/${id}`, tenant);
  return response.data;
};

export const getTenantById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/tenants/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTenantById = async (id: string) => {
  const response = await axios.delete(`/api/tenants/${id}`);
  return response.data;
};
