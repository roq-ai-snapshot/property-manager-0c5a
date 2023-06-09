import * as yup from 'yup';

export const rentPaymentValidationSchema = yup.object().shape({
  amount: yup.number().integer().required(),
  payment_date: yup.date().required(),
  tenant_id: yup.string().nullable().required(),
});
