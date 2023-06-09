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
import { getMaintenanceTaskById, updateMaintenanceTaskById } from 'apiSdk/maintenance-tasks';
import { Error } from 'components/error';
import { maintenanceTaskValidationSchema } from 'validationSchema/maintenance-tasks';
import { MaintenanceTaskInterface } from 'interfaces/maintenance-task';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { MaintenanceScheduleInterface } from 'interfaces/maintenance-schedule';
import { getMaintenanceSchedules } from 'apiSdk/maintenance-schedules';

function MaintenanceTaskEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MaintenanceTaskInterface>(
    () => (id ? `/maintenance-tasks/${id}` : null),
    () => getMaintenanceTaskById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MaintenanceTaskInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMaintenanceTaskById(id, values);
      mutate(updated);
      resetForm();
      router.push('/maintenance-tasks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MaintenanceTaskInterface>({
    initialValues: data,
    validationSchema: maintenanceTaskValidationSchema,
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
            Edit Maintenance Task
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
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<MaintenanceScheduleInterface>
              formik={formik}
              name={'schedule_id'}
              label={'Select Maintenance Schedule'}
              placeholder={'Select Maintenance Schedule'}
              fetcher={getMaintenanceSchedules}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.start_date as any}
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
  entity: 'maintenance_task',
  operation: AccessOperationEnum.UPDATE,
})(MaintenanceTaskEditPage);
