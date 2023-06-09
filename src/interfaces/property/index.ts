import { MaintenanceScheduleInterface } from 'interfaces/maintenance-schedule';
import { SupplyOrderInterface } from 'interfaces/supply-order';
import { TenantInterface } from 'interfaces/tenant';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface PropertyInterface {
  id?: string;
  address: string;
  rent: number;
  company_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  maintenance_schedule?: MaintenanceScheduleInterface[];
  supply_order?: SupplyOrderInterface[];
  tenant?: TenantInterface[];
  company?: CompanyInterface;
  _count?: {
    maintenance_schedule?: number;
    supply_order?: number;
    tenant?: number;
  };
}

export interface PropertyGetQueryInterface extends GetQueryInterface {
  id?: string;
  address?: string;
  company_id?: string;
}
