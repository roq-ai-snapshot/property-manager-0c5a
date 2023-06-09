import * as yup from 'yup';

export const maintenanceTaskValidationSchema = yup.object().shape({
  description: yup.string().required(),
  status: yup.string().required(),
  schedule_id: yup.string().nullable().required(),
});
