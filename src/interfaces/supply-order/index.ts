import { PropertyInterface } from 'interfaces/property';
import { GetQueryInterface } from 'interfaces';

export interface SupplyOrderInterface {
  id?: string;
  item_name: string;
  quantity: number;
  property_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  property?: PropertyInterface;
  _count?: {};
}

export interface SupplyOrderGetQueryInterface extends GetQueryInterface {
  id?: string;
  item_name?: string;
  property_id?: string;
}
