import * as yup from 'yup';
import { propertyValidationSchema } from 'validationSchema/properties';

export const companyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  user_id: yup.string().nullable().required(),
  property: yup.array().of(propertyValidationSchema),
});
