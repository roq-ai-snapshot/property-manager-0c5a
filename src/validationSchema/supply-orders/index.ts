import * as yup from 'yup';

export const supplyOrderValidationSchema = yup.object().shape({
  item_name: yup.string().required(),
  quantity: yup.number().integer().required(),
  property_id: yup.string().nullable().required(),
});
