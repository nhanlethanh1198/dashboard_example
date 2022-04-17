import {useLayoutEffect, useState, useRef, useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigate, useParams} from 'react-router-dom';
import {StaffUpdateSchema} from 'src/schema/StaffSchema';
import {useSnackbar} from 'notistack';
import {Container, Typography, Card, Stack, LinearProgress} from '@mui/material';
import Page from 'src/components/Page';
import {StaffForm} from 'src/components/_dashboard/staff';
import {getStaffInfoAPI, putStaffEditAPI} from 'src/api/staff';
import {formatTimeToLocal} from 'src/utils/formatTime';

const UpdateStaff = () => {
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const {staff_id} = useParams();
  const {enqueueSnackbar} = useSnackbar();
  const [images, setImages] = useState({
    avatar_img: '',
    id_card_img_1: '',
    id_card_img_2: '',
  });

  const [loading, setLoading] = useState(true);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(StaffUpdateSchema),
    defaultValues: {
      avatar_img: '',
      id_card_img_1: '',
      id_card_img_2: '',
    },
  });
  const {setValue} = methods;

  const onSubmit = useCallback(
    async (data) => {
      const imageFields = ['avatar_img', 'id_card_img_1', 'id_card_img_2'];

      const submit = Object.assign({}, data);
      delete submit.confirm_password;

      console.log(submit)

      const formData = new FormData();

      Object.keys(submit).forEach((key) => {
        if (imageFields.includes(key)) {
          if (submit[key].length > 0 && submit[key][0] !== undefined) {
            formData.append(key, submit[key][0]);
          }
        } else if (key === 'dob') {
          const date = new Date(submit.dob);
          const res = formatTimeToLocal(date);
          formData.append('dob', res);
        } else {
          formData.append(key, submit[key]);
        }
      });

      await putStaffEditAPI(staff_id, formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Cập nhật thông tin thành công!', {variant: 'success'});
            navigate(-1, {replace: true});
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Cập nhật lỗI! Mời thử lại!', {variant: 'error'});
        });
    },
    [enqueueSnackbar, navigate, staff_id]
  );

  const setInitData = useCallback(
    (data) => {
      const fieldArray = [
        'fullname',
        'dob',
        'gender',
        'id_card',
        'email',
        'province_code',
        'district_code',
        'address',
        'role',
        'phone',
        'password',
      ];
      fieldArray.forEach((key) => {
        setValue(key, data[key] || '', {shouldDirty: true});
      });
    },
    [setValue]
  );

  const getStaffInfo = useCallback(
    async (staff_id) => {
      await getStaffInfoAPI(staff_id)
        .then((res) => {
          if (res.status === 200) {
            const data = res.data.data;
            setImages({
              avatar_img: data.avatar_img,
              id_card_img_1: data.id_card_img_1,
              id_card_img_2: data.id_card_img_2,
            });
            setInitData(data);
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Tải thông tin thất bại! Mời bạn thử lại!', {variant: 'error'});
        })
        .finally(() => setLoading(false));

      return () => {};
    },
    [setInitData, enqueueSnackbar]
  );

  useLayoutEffect(() => {
    getStaffInfo(staff_id);
    return () => {};
    // eslint-disable-next-line
  }, [staff_id]);

  return (
    <Page title="Cập nhật nhân viên">
      <Container>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa nhân viên
        </Typography>
        <Card>
          <Stack m={5}>
            {loading ? (
              <LinearProgress />
            ) : (
              <StaffForm
                methods={methods}
                onSubmit={onSubmit}
                ref={imageRef}
                userImage={images}
                update
              />
            )}
          </Stack>
        </Card>
      </Container>
    </Page>
  );
};

export default UpdateStaff;
