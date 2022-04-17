import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {useEffect, useRef, useCallback} from 'react';
// material
import {Container, Typography, Card, Stack} from '@mui/material';

// Component
import Page from 'src/components/Page';
import {StaffForm} from 'src/components/_dashboard/staff';
import {postNewStaffAPI} from 'src/api/staff';
import {StaffAddSchema} from 'src/schema/StaffSchema';
import {formatTimeToLocal} from 'src/utils/formatTime';

const AddStaff = () => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const imageRef = useRef(null);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValue: {
      fullname: '',
      dob: new Date(),
      email: '',
      phone: '',
      id_card: '',
      address: '',
      role: '',
      avatar_img: undefined,
      password: '',
      confirm_password: '',
      id_card_img_1: undefined,
      id_card_img_2: undefined,
    },
    resolver: yupResolver(StaffAddSchema),
  });

  const {setValue} = methods;

  useEffect(() => {
    setValue('role', 'unset');
  }, [setValue]);

  const onSubmit = useCallback(
    async (data) => {
      const submit = Object.assign({}, data);
      delete submit.confirm_password;
      const formData = new FormData();
      const imageFields = ['avatar_img', 'id_card_img_1', 'id_card_img_2'];
      Object.keys(submit).forEach((key) => {
        if (imageFields.includes(key)) {
          formData.append(key, submit[key][0]);
        } else if (key === 'dob') {
          const date = new Date(submit.dob);
          const res = formatTimeToLocal(date);
          formData.append('dob', res);
        } else {
          formData.append(key, submit[key]);
        }
      });

      await postNewStaffAPI(formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Thêm nhân viên mới thành công!', {variant: 'success'});
            navigate(-1, {replace: true});
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Thêm nhân viên thất bại, mời thử lại!', {variant: 'error'});
        });
    },
    [enqueueSnackbar, navigate]
  );

  return (
    <>
      <Page title="Thêm nhân viên">
        <Container>
          <Typography variant="h4" gutterBottom sx={{md: 2}}>
            Tạo nhân viên
          </Typography>
          <Card>
            <Stack m={5}>
              <StaffForm
                methods={methods}
                onSubmit={onSubmit}
                initImage={{
                  avatar_img: '',
                  id_card_img_1: '',
                  id_card_img_2: '',
                }}
                ref={imageRef}
              />
            </Stack>
          </Card>
        </Container>
      </Page>
    </>
  );
};

export default AddStaff;
