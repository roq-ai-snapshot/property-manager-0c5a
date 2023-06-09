import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getTenantById, updateTenantById } from 'apiSdk/tenants';
import { Error } from 'components/error';
import { tenantValidationSchema } from 'validationSchema/tenants';
import { TenantInterface } from 'interfaces/tenant';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PropertyInterface } from 'interfaces/property';
import { getProperties } from 'apiSdk/properties';
import { rentPaymentValidationSchema } from 'validationSchema/rent-payments';

function TenantEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TenantInterface>(
    () => (id ? `/tenants/${id}` : null),
    () => getTenantById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TenantInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTenantById(id, values);
      mutate(updated);
      resetForm();
      router.push('/tenants');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TenantInterface>({
    initialValues: data,
    validationSchema: tenantValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Tenant
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="first_name" mb="4" isInvalid={!!formik.errors?.first_name}>
              <FormLabel>First Name</FormLabel>
              <Input type="text" name="first_name" value={formik.values?.first_name} onChange={formik.handleChange} />
              {formik.errors.first_name && <FormErrorMessage>{formik.errors?.first_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="last_name" mb="4" isInvalid={!!formik.errors?.last_name}>
              <FormLabel>Last Name</FormLabel>
              <Input type="text" name="last_name" value={formik.values?.last_name} onChange={formik.handleChange} />
              {formik.errors.last_name && <FormErrorMessage>{formik.errors?.last_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="contact_details" mb="4" isInvalid={!!formik.errors?.contact_details}>
              <FormLabel>Contact Details</FormLabel>
              <Input
                type="text"
                name="contact_details"
                value={formik.values?.contact_details}
                onChange={formik.handleChange}
              />
              {formik.errors.contact_details && <FormErrorMessage>{formik.errors?.contact_details}</FormErrorMessage>}
            </FormControl>
            <FormControl id="rent_amount" mb="4" isInvalid={!!formik.errors?.rent_amount}>
              <FormLabel>Rent Amount</FormLabel>
              <NumberInput
                name="rent_amount"
                value={formik.values?.rent_amount}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('rent_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.rent_amount && <FormErrorMessage>{formik.errors?.rent_amount}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<PropertyInterface>
              formik={formik}
              name={'property_id'}
              label={'Select Property'}
              placeholder={'Select Property'}
              fetcher={getProperties}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.address as any}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'tenant',
  operation: AccessOperationEnum.UPDATE,
})(TenantEditPage);
