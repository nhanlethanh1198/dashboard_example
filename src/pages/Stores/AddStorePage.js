import {useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {yupResolver} from '@hookform/resolvers/yup';
import {Container, Stack, Typography} from '@mui/material';
import Page from 'src/components/Page';
import {StoreForm} from 'src/components/_dashboard/stores';
import {AddProviderSchema} from 'src/schema/ProviderSchema';
import {createStore} from 'src/api/stores';

const AddStoresPage = () => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      email: '',
    },
    resolver: yupResolver(AddProviderSchema),
  });

  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('address', data.address)
      formData.append('district_code', data.district_code)
      formData.append('province_code', data.province_code)
      
      if (data.email) {
        formData.append('email', data.email);
      }

      if (data.description) {
        formData.append('description', data.description);
      }

      if (data.avatar && data.avatar.length > 0) {
        formData.append('avatar', data.avatar[0]);
      }

      await createStore(formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Tạo nhà cung cấp mớI thành công', {
              variant: 'success',
            });
            navigate(-1);
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, {variant: 'error'});
          enqueueSnackbar('Tạo nhà cung cấp thất bại! Mời thử lại!', {
            variant: 'error',
            preventDuplicate: 0,
          });
        });
      return () => {};
    },
    [enqueueSnackbar, navigate]
  );

  return (
    <Page title="Thêm nhà cung cấp mới">
      <Container maxWidth={'xl'}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h2" align="left" gutterBottom>
            Thêm nhà cung cấp mới
          </Typography>
          <StoreForm methods={methods} onSubmit={onSubmit} id="add" />
        </Stack>
      </Container>
    </Page>
  );
};

export default AddStoresPage;
