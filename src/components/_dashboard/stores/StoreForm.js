import PropTypes from 'prop-types';
import {FormProvider, Controller} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Stack,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {getDistricts, getProvinces} from '../../../api/location';

const StoreForm = ({methods, onSubmit, id, initImage}) => {
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [imgReview, setImgReview] = useState(null);
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors, isSubmitting},
  } = methods;

  const province = watch('province_code');
  const district = watch('district_code');

  const onError = (data) => {
    Object.keys(data).forEach((key) => {
      enqueueSnackbar(data[key], {variant: 'error'});
    });
  };

  const isShrinkTextField = () => {
    if (id === 'update') {
      return {
        InputLabelProps: {
          shrink: true,
        },
      };
    }
    return {};
  };

  const setImageReview = useCallback((initImage) => {
    if (initImage) {
      setImgReview(initImage);
    }
    return () => {
    };
  }, []);

  const handleChangeImg = useCallback(
    (e) => {
      let imgURL = null;
      const {name, files} = e.target;

      if (name === 'avatar' && files.length > 0) {
        imgURL = URL.createObjectURL(files[0]);
        setImageReview(imgURL);
      }
      return () => URL.revokeObjectURL(imgURL);
    },
    [setImageReview],
  );

  const getProvincesList = useCallback(async () => {
    await getProvinces()
      .then((res) => {
        setProvinceList(res.data);
      })
      .catch((err) => {
        console.log(err.message);
        enqueueSnackbar('Không thể tải danh sách địa chỉ, xin mời thử lại!', {variant: 'error'});
      });
    return () => {
    };
  }, [enqueueSnackbar]);

  const getDistrictsList = useCallback(
    async (province_code) => {
      // get Districts
      await getDistricts({province_code})
        .then((res) => {
          setDistrictList(res.data.districts);
        })
        .catch((err) => {
          console.log(err.message);
          enqueueSnackbar('Không thể tải danh sách địa chỉ, xin mời thử lại!', {
            variant: 'error',
          });
          setDistrictList([]);
        });

      return () => {
      };
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    setImageReview(initImage);
    getProvincesList();
    return () => {
    };
  }, [setImageReview, initImage, getProvincesList]);

  useLayoutEffect(() => {
    // For update
    if (province !== '') {
      getDistrictsList(province);
    }
    return () => {
    };
  }, [province, getDistrictsList]);

  return (
    <Card>
      <CardContent>
        <Typography variant='h6' align='center'>
          Thông tin nhà cung cấp
        </Typography>
        <FormProvider {...methods}>
          <form
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit, onError)}
            onChange={handleChangeImg}
            id={`store_form_${!!id ? id : 'default'}`}
          >
            <Grid container sx={{p: 3}} columnSpacing={3}>
              <Grid item xs={12} md={8} container spacing={2} sx={{flexDirection: 'row'}}>
                <TextField
                  fullWidth
                  {...register('name')}
                  margin='dense'
                  label='Tên nhà cung cấp*'
                  autoFocus
                  error={!!errors?.name?.message}
                  helperText={errors?.name?.message}
                  {...isShrinkTextField(id)}
                />
                <TextField
                  fullWidth
                  {...register('email')}
                  margin='dense'
                  label='Email*'
                  error={!!errors?.email?.message}
                  helperText={errors?.email?.message}
                  {...isShrinkTextField(id)}
                />
                <TextField
                  fullWidth
                  {...register('phone')}
                  margin='dense'
                  label='Số điện thoại liên hệ*'
                  error={!!errors?.phone?.message}
                  helperText={errors?.phone?.message}
                  {...isShrinkTextField(id)}
                />
                <TextField
                  fullWidth
                  {...register('description')}
                  margin='dense'
                  label='Mô tả về cửa hàng:'
                  error={!!errors?.phone?.description}
                  helperText={errors?.phone?.description}
                  {...isShrinkTextField(id)}
                  multiline
                  minRows={3}
                />

                <Box sx={{
                  width: '100%',
                }}>
                  <Typography variant='h6' mb={2} align={'center'}>
                    Địa chỉ liên hệ
                  </Typography>
                  <Stack direction='row' justifyContent='space-between' spacing={2} mb={2}>
                    <Controller
                      control={control}
                      name='province_code'
                      defaultValue={province || 0}
                      render={({field}) => (
                        <FormControl fullWidth size='small'>
                          <InputLabel id='set_province_label'>Tỉnh/Thành phố</InputLabel>
                          <Select
                            labelId='set_province_label'
                            label='Tỉnh/Thành phố'
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          >
                            <MenuItem value={0} disabled sx={{display: 'none'}}>
                              Chọn Tỉnh/Thành phố
                            </MenuItem>
                            {provinceList?.map((item) => (
                              <MenuItem key={item.code} value={item.code}>
                                {item.fullname}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />

                    <Controller
                      control={control}
                      name='district_code'
                      defaultValue={district || 0}
                      render={({field}) => (
                        <FormControl fullWidth size='small'>
                          <InputLabel id='set_district_label'>Quận/Huyện</InputLabel>
                          <Select
                            labelId='set_district_label'
                            label='Quận/Huyện'
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={province === ''}
                            MenuProps={{
                              sx: {maxHeight: '300px'},
                            }}
                          >
                            <MenuItem value={0} disabled sx={{display: 'none'}}>
                              Chọn Quận/Huyện
                            </MenuItem>
                            {districtList?.map((item) => (
                              <MenuItem key={item.code} value={item.code}>
                                {item.fullname}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Stack>


                  <TextField
                    fullWidth
                    {...register('address')}
                    margin='dense'
                    label='Địa chỉ liên hệ*'
                    error={!!errors?.address?.message}
                    helperText={errors?.address?.message}
                    {...isShrinkTextField(id)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} container justifyContent='center' sx={{flexDirection: 'column'}}>
                <Card>
                  <CardMedia
                    component='img'
                    height='300'
                    src={
                      imgReview ||
                      'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
                    }
                  />
                </Card>
                <Stack mt={3}>
                  <label htmlFor='store_avatar_image'>
                    <input
                      id='store_avatar_image'
                      style={{display: 'none'}}
                      type='file'
                      accept='image/*'
                      {...register('avatar')}
                    />
                    <Button
                      component='span'
                      variant='contained'
                      color={imgReview ? 'warning' : 'primary'}
                      startIcon={<FileUploadIcon />}
                      fullWidth
                    >
                      {imgReview ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                    </Button>
                  </label>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </CardContent>
      <CardActions sx={{justifyContent: 'center', my: 2, gap: 3}}>
        <Button
          sx={{width: '230px'}}
          color='error'
          onClick={() => navigate(-1)}
          variant='contained'
          startIcon={<CancelIcon />}
        >
          Hủy
        </Button>
        <LoadingButton
          sx={{width: '230px'}}
          type='submit'
          form={`store_form_${!!id ? id : 'default'}`}
          variant='contained'
          loading={isSubmitting}
          startIcon={<CheckCircleOutlineOutlinedIcon />}
        >
          {id === 'update' ? 'Lưu' : 'Thêm nhà cung cấp mới'}
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

StoreForm.propTypes = {
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  id: PropTypes.string,
  initImage: PropTypes.string,
};

StoreForm.defaultProps = {
  id: 'add',
};

export default StoreForm;
