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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createSupplyOrder } from 'apiSdk/supply-orders';
import { Error } from 'components/error';
import { supplyOrderValidationSchema } from 'validationSchema/supply-orders';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PropertyInterface } from 'interfaces/property';
import { getProperties } from 'apiSdk/properties';
import { SupplyOrderInterface } from 'interfaces/supply-order';

function SupplyOrderCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SupplyOrderInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSupplyOrder(values);
      resetForm();
      router.push('/supply-orders');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SupplyOrderInterface>({
    initialValues: {
      item_name: '',
      quantity: 0,
      property_id: (router.query.property_id as string) ?? null,
    },
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
            Create Supply Order
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'supply_order',
  operation: AccessOperationEnum.CREATE,
})(SupplyOrderCreatePage);
