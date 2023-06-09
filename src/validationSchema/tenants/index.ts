import * as yup from 'yup';
import { rentPaymentValidationSchema } from 'validationSchema/rent-payments';

export const tenantValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  contact_details: yup.string().required(),
  rent_amount: yup.number().integer().required(),
  property_id: yup.string().nullable().required(),
  rent_payment: yup.array().of(rentPaymentValidationSchema),
});
