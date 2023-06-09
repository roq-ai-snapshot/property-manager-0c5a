import axios from 'axios';
import queryString from 'query-string';
import { MaintenanceTaskInterface, MaintenanceTaskGetQueryInterface } from 'interfaces/maintenance-task';
import { GetQueryInterface } from '../../interfaces';

export const getMaintenanceTasks = async (query?: MaintenanceTaskGetQueryInterface) => {
  const response = await axios.get(`/api/maintenance-tasks${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMaintenanceTask = async (maintenanceTask: MaintenanceTaskInterface) => {
  const response = await axios.post('/api/maintenance-tasks', maintenanceTask);
  return response.data;
};

export const updateMaintenanceTaskById = async (id: string, maintenanceTask: MaintenanceTaskInterface) => {
  const response = await axios.put(`/api/maintenance-tasks/${id}`, maintenanceTask);
  return response.data;
};

export const getMaintenanceTaskById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/maintenance-tasks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMaintenanceTaskById = async (id: string) => {
  const response = await axios.delete(`/api/maintenance-tasks/${id}`);
  return response.data;
};
