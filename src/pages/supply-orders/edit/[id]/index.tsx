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
import { getSupplyOrderById, updateSupplyOrderById } from 'apiSdk/supply-orders';
import { Error } from 'components/error';
import { supplyOrderValidationSchema } from 'validationSchema/supply-orders';
import { SupplyOrderInterface } from 'interfaces/supply-order';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PropertyInterface } from 'interfaces/property';
import { getProperties } from 'apiSdk/properties';

function SupplyOrderEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SupplyOrderInterface>(
    () => (id ? `/supply-orders/${id}` : null),
    () => getSupplyOrderById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SupplyOrderInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSupplyOrderById(id, values);
      mutate(updated);
      resetForm();
      router.push('/supply-orders');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SupplyOrderInterface>({
    initialValues: data,
    validationSchema: supplyOrderValidationSchema,
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
            Edit Supply Order
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
            <FormControl id="item_name" mb="4" isInvalid={!!formik.errors?.item_name}>
              <FormLabel>Item Name</FormLabel>
              <Input type="text" name="item_name" value={formik.values?.item_name} onChange={formik.handleChange} />
              {formik.errors.item_name && <FormErrorMessage>{formik.errors?.item_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="quantity" mb="4" isInvalid={!!formik.errors?.quantity}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                name="quantity"
                value={formik.values?.quantity}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('quantity', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.quantity && <FormErrorMessage>{formik.errors?.quantity}</FormErrorMessage>}
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
  entity: 'supply_order',
  operation: AccessOperationEnum.UPDATE,
})(SupplyOrderEditPage);
