import { MaintenanceScheduleInterface } from 'interfaces/maintenance-schedule';
import { GetQueryInterface } from 'interfaces';

export interface MaintenanceTaskInterface {
  id?: string;
  description: string;
  status: string;
  schedule_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  maintenance_schedule?: MaintenanceScheduleInterface;
  _count?: {};
}

export interface MaintenanceTaskGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  status?: string;
  schedule_id?: string;
}
