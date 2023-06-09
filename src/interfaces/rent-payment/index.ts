import { TenantInterface } from 'interfaces/tenant';
import { GetQueryInterface } from 'interfaces';

export interface RentPaymentInterface {
  id?: string;
  amount: number;
  payment_date: Date | string;
  tenant_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  tenant?: TenantInterface;
  _count?: {};
}

export interface RentPaymentGetQueryInterface extends GetQueryInterface {
  id?: string;
  tenant_id?: string;
}
