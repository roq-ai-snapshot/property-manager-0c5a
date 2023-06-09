import * as yup from 'yup';
import { maintenanceTaskValidationSchema } from 'validationSchema/maintenance-tasks';

export const maintenanceScheduleValidationSchema = yup.object().shape({
  start_date: yup.date().required(),
  end_date: yup.date().required(),
  property_id: yup.string().nullable().required(),
  maintenance_task: yup.array().of(maintenanceTaskValidationSchema),
});
