import axios from 'axios';
import queryString from 'query-string';
import { CompanyInterface, CompanyGetQueryInterface } from 'interfaces/company';
import { GetQueryInterface } from '../../interfaces';

export const getCompanies = async (query?: CompanyGetQueryInterface) => {
  const response = await axios.get(`/api/companies${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCompany = async (company: CompanyInterface) => {
  const response = await axios.post('/api/companies', company);
  return response.data;
};

export const updateCompanyById = async (id: string, company: CompanyInterface) => {
  const response = await axios.put(`/api/companies/${id}`, company);
  return response.data;
};

export const getCompanyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/companies/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCompanyById = async (id: string) => {
  const response = await axios.delete(`/api/companies/${id}`);
  return response.data;
};
