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
import { getMaintenanceScheduleById, updateMaintenanceScheduleById } from 'apiSdk/maintenance-schedules';
import { Error } from 'components/error';
import { maintenanceScheduleValidationSchema } from 'validationSchema/maintenance-schedules';
import { MaintenanceScheduleInterface } from 'interfaces/maintenance-schedule';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PropertyInterface } from 'interfaces/property';
import { getProperties } from 'apiSdk/properties';
import { maintenanceTaskValidationSchema } from 'validationSchema/maintenance-tasks';

function MaintenanceScheduleEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MaintenanceScheduleInterface>(
    () => (id ? `/maintenance-schedules/${id}` : null),
    () => getMaintenanceScheduleById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MaintenanceScheduleInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMaintenanceScheduleById(id, values);
      mutate(updated);
      resetForm();
      router.push('/maintenance-schedules');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MaintenanceScheduleInterface>({
    initialValues: data,
    validationSchema: maintenanceScheduleValidationSchema,
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
            Edit Maintenance Schedule
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
            <FormControl id="start_date" mb="4">
              <FormLabel>Start Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.start_date as Date}
                onChange={(value: Date) => formik.setFieldValue('start_date', value)}
              />
            </FormControl>
            <FormControl id="end_date" mb="4">
              <FormLabel>End Date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.end_date as Date}
                onChange={(value: Date) => formik.setFieldValue('end_date', value)}
              />
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
  entity: 'maintenance_schedule',
  operation: AccessOperationEnum.UPDATE,
})(MaintenanceScheduleEditPage);
