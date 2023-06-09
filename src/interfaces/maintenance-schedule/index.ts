import { MaintenanceTaskInterface } from 'interfaces/maintenance-task';
import { PropertyInterface } from 'interfaces/property';
import { GetQueryInterface } from 'interfaces';

export interface MaintenanceScheduleInterface {
  id?: string;
  start_date: Date | string;
  end_date: Date | string;
  property_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  maintenance_task?: MaintenanceTaskInterface[];
  property?: PropertyInterface;
  _count?: {
    maintenance_task?: number;
  };
}

export interface MaintenanceScheduleGetQueryInterface extends GetQueryInterface {
  id?: string;
  property_id?: string;
}
