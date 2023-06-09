import * as yup from 'yup';
import { maintenanceScheduleValidationSchema } from 'validationSchema/maintenance-schedules';
import { supplyOrderValidationSchema } from 'validationSchema/supply-orders';
import { tenantValidationSchema } from 'validationSchema/tenants';

export const propertyValidationSchema = yup.object().shape({
  address: yup.string().required(),
  rent: yup.number().integer().required(),
  company_id: yup.string().nullable().required(),
  maintenance_schedule: yup.array().of(maintenanceScheduleValidationSchema),
  supply_order: yup.array().of(supplyOrderValidationSchema),
  tenant: yup.array().of(tenantValidationSchema),
});
