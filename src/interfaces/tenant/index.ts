import { RentPaymentInterface } from 'interfaces/rent-payment';
import { PropertyInterface } from 'interfaces/property';
import { GetQueryInterface } from 'interfaces';

export interface TenantInterface {
  id?: string;
  first_name: string;
  last_name: string;
  contact_details: string;
  rent_amount: number;
  property_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  rent_payment?: RentPaymentInterface[];
  property?: PropertyInterface;
  _count?: {
    rent_payment?: number;
  };
}

export interface TenantGetQueryInterface extends GetQueryInterface {
  id?: string;
  first_name?: string;
  last_name?: string;
  contact_details?: string;
  property_id?: string;
}
