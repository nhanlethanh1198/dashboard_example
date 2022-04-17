import {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useParams, useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Collapse, Container, Stack, Typography} from '@mui/material';
import Page from 'src/components/Page';
import {StoreForm} from 'src/components/_dashboard/stores';
import {updateStoreById, getStoreById} from 'src/api/stores';

const UpdateStorePage = () => {
  const {id} = useParams();
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initImage, setInitImage] = useState(null);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  const {setValue} = methods;

  const setFieldValue = useCallback(
    (data) => {
      setValue('name', data.name);
      setValue('phone', data.phone);
      setValue('address', data.address);
      setValue('email', data.email);
      setValue('description', data.description);
      setValue('province_code', data.province_code);
      setValue('district_code', data.district_code);
      setInitImage(data.avatar);
      return () => {};
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();

      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('province_code', data.province_code);
      formData.append('district_code', data.district_code);
      
      if (data.email) {
        formData.append('email', data.email);
      }

      if (data.description) {
        formData.append('description', data.description);
      }

      if (data.avatar && data.avatar.length > 0) {
        formData.append('avatar', data.avatar[0]);
      }

      await updateStoreById(id, formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Cập nhật nhà cung cấp thành công!', {
              variant: 'success',
            });
            navigate(-1);
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, {variant: 'error'});
          enqueueSnackbar('Cập nhật thất bại! Mời thử lại!', {
            variant: 'error',
            preventDuplicate: false,
          });
        });
    },
    [enqueueSnackbar, navigate, id]
  );

  useEffect(() => {
    // Call api here
    getStoreById(id).then((res) => {
      if (res.status === 200) {
        setFieldValue(res.data.data);
        setLoading(false);
      }
    });
  }, [setLoading, setFieldValue, id]);

  return (
    <Page title="Chỉnh sửa nhà cung cấp">
      <Container maxWidth={'xl'}>
        <Stack>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Chỉnh sửa nhà cung cấp
          </Typography>
          <Collapse in={!loading}>
            <StoreForm methods={methods} onSubmit={onSubmit} id="update" initImage={initImage} />
          </Collapse>
        </Stack>
      </Container>
    </Page>
  );
};

export default UpdateStorePage;
