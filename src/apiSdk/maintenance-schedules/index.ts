import axios from 'axios';
import queryString from 'query-string';
import { MaintenanceScheduleInterface, MaintenanceScheduleGetQueryInterface } from 'interfaces/maintenance-schedule';
import { GetQueryInterface } from '../../interfaces';

export const getMaintenanceSchedules = async (query?: MaintenanceScheduleGetQueryInterface) => {
  const response = await axios.get(`/api/maintenance-schedules${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMaintenanceSchedule = async (maintenanceSchedule: MaintenanceScheduleInterface) => {
  const response = await axios.post('/api/maintenance-schedules', maintenanceSchedule);
  return response.data;
};

export const updateMaintenanceScheduleById = async (id: string, maintenanceSchedule: MaintenanceScheduleInterface) => {
  const response = await axios.put(`/api/maintenance-schedules/${id}`, maintenanceSchedule);
  return response.data;
};

export const getMaintenanceScheduleById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/maintenance-schedules/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteMaintenanceScheduleById = async (id: string) => {
  const response = await axios.delete(`/api/maintenance-schedules/${id}`);
  return response.data;
};
