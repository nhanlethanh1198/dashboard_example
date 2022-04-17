import {FormProvider, Controller} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {useState, memo, forwardRef, useEffect, useLayoutEffect, useCallback} from 'react';
import {
  Stack,
  Box,
  Grid,
  Input,
  TextField,
  FormHelperText,
  FormControl,
  InputLabel,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  IconButton, RadioGroup, Radio, FormControlLabel,
} from '@mui/material';

import {StaffUploadImage} from '.';

import {Icon} from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import {LoadingButton, LocalizationProvider, DesktopDatePicker} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import viLocale from 'date-fns/locale/vi';
import {experimentalStyled as styled} from '@mui/material/styles';
import {useSnackbar} from 'notistack';

import {getProvinces, getDistricts} from 'src/api/location';

const MARGIN_BOTTOM = 3;

const InputGroup = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  '&>div:last-of-type': {
    width: '70%',
  },
  '& p': {
    display: 'block',
    width: '70%',
    marginLeft: 'auto',
  },
});

const CustomInputField = memo(
  ({label, touchedField, error, dirtyField, register, name, type, autoFocus}) => {
    const [showPassword, setShowPassword] = useState(false);
    if (type === 'password') {
      return (
        <InputGroup sx={{mb: MARGIN_BOTTOM}}>
          <InputLabel
            error={Boolean(!!touchedField && !!error?.message)}
            focused={Boolean(!!touchedField || !!dirtyField)}
          >
            {label}
          </InputLabel>
          <Input
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register(name)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                  <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText error={Boolean(!!touchedField && !!error?.message)}>
            {!!dirtyField && !!touchedField && error?.message}
          </FormHelperText>
        </InputGroup>
      );
    } else {
      return (
        <InputGroup sx={{mb: MARGIN_BOTTOM}}>
          <InputLabel error={!!touchedField && !!error} focused={!!touchedField || !!dirtyField}>
            {label}
          </InputLabel>
          <Input autoFocus={!!autoFocus} type={type} fullWidth {...register(name)} />
          {!!error?.message && <FormHelperText error>{error?.message}</FormHelperText>}
        </InputGroup>
      );
    }
  },
);

const StaffForm = ({methods, onSubmit, userImage, update}, ref) => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [images, setImages] = useState({});
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  const roleName = [
    {
      value: 'staff',
      label: 'Nhân viên',
    },
    {
      value: 'admin',
      label: 'Quản trị viên',
    },
    {
      value: 'partner',
      label: 'Đối tác',
    },
  ];

  // Define Methods from react-hook-form
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors, dirtyFields, touchedFields, isSubmitting},
  } = methods;

  const province = watch('province_code');
  const district = watch('district_code');

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
    setImages(userImage);
    getProvincesList();
    // setProvinceForUpdate(province);
    return () => {
    };
  }, [userImage, getProvincesList]);

  useLayoutEffect(() => {
    // For update
    if (province !== '') {
      getDistrictsList(province);
    }
    return () => {
    };
  }, [province, getDistrictsList]);

  const handleChange = useCallback(
    (event) => {
      const imageField = ['avatar_img', 'id_card_img_1', 'id_card_img_2'];
      const {name, files} = event.target;
      let imgURLReview = null;
      if (imageField.includes(name)) {
        if (files.length > 0 && files[0]) {
          imgURLReview = URL.createObjectURL(files[0]);
          setImages({
            ...images,
            [name]: imgURLReview,
          });
        }
      }
      return () => URL.revokeObjectURL(imgURLReview);
    },
    [images],
  );

  const onError = (data, e) => {
    console.error(data);
    Object.keys(data).forEach((key) => {
      enqueueSnackbar(data[key].message, {variant: 'warning'});
    });
  };

  return (
    <FormProvider {...methods}>
      <Box
        component='form'
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit, onError)}
        onChange={handleChange}
        id='add_staff_form'
        encType='multipart/form-data'
        noValidate
        ref={ref}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={9}>
            <CustomInputField
              label='Họ và tên*:'
              register={register}
              touchedField={touchedFields?.fullname}
              error={errors?.fullname}
              dirtyField={dirtyFields?.fullname}
              name='fullname'
              type='text'
              autoFocus
            />
            <InputGroup sx={{mb: 3}}>
              <InputLabel focused={dirtyFields.dob} errors={errors.dob}>
                Ngày sinh*:
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                <Controller
                  name='dob'
                  control={control}
                  render={({field}) => {
                    return (
                      <DesktopDatePicker
                        {...field}
                        disableFuture
                        mask='__/__/____'
                        openTo='year'
                        views={['year', 'month', 'day']}
                        value={field.value}
                        onChange={(newValue) => {
                          methods.setValue(field.name, newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            helperText={null}
                            variant='standard'
                            error={false && params.error}
                          />
                        )}
                      />
                    );
                  }}
                />
              </LocalizationProvider>
              <FormHelperText error={Boolean(touchedFields.dob && errors.dob)}>
                {touchedFields.dob && errors.dob}
              </FormHelperText>
            </InputGroup>
            <InputGroup sx={{mb: 4}}>
              <InputLabel focused={dirtyFields.gender}>
                Giới tính*:
              </InputLabel>
              <FormControl>
                <Controller
                  name={'gender'}
                  control={control}
                  render={({field}) => (
                    <RadioGroup value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
                      <Stack direction={'row'}>
                        <FormControlLabel
                          value='male'
                          control={<Radio />}
                          label={'Nam'}
                        />
                        <FormControlLabel
                          value='female'
                          control={<Radio />}
                          label={'Nữ'}
                        />
                        <FormControlLabel
                          value={'diff'}
                          control={<Radio />}
                          label={'Khác'}
                        />
                      </Stack>
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </InputGroup>
            <CustomInputField
              label='Số CMND/CCCD*:'
              register={register}
              touchedField={touchedFields?.id_card}
              error={errors?.id_card}
              dirtyField={dirtyFields?.id_card}
              name='id_card'
              type='text'
            />
            <CustomInputField
              label='Email*:'
              register={register}
              touchedField={touchedFields?.email}
              error={errors?.email}
              dirtyField={dirtyFields?.email}
              name='email'
              type='email'
            />
            <CustomInputField
              label='Số điện thoại*:'
              register={register}
              touchedField={touchedFields?.phone}
              error={errors?.phone}
              dirtyField={dirtyFields?.phone}
              name='phone'
              type='tel'
            />
            <Stack direction='row' sx={{mb: 4}} justifyContent='space-between'>
              <InputLabel>Địa chỉ hiện tại*:</InputLabel>
              <Stack direction='column' sx={{width: '70%'}} spacing={2}>
                <Stack direction='row' justifyContent='space-between' spacing={2}>
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
                          {provinceList.map((item) => (
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
                  size='small'
                  label='Số nhà, đường, phường/xã'
                  {...register('address')}
                  error={Boolean(!!touchedFields?.addresss && !!errors?.addresss?.message)}
                  focused={Boolean(!!touchedFields?.addresss || !!dirtyFields?.addresss)}
                  InputLabelProps={update ? {shrink: true} : {}}
                />
              </Stack>
            </Stack>

            <InputGroup sx={{mb: MARGIN_BOTTOM}}>
              <InputLabel
                error={Boolean(!!touchedFields?.role && !!errors?.role?.message)}
                focused={Boolean(!!touchedFields?.role || !!dirtyFields?.role)}
              >
                Chức vụ*:
              </InputLabel>
              <Controller
                control={control}
                name='role'
                render={({field}) => {
                  return (
                    <Select
                      name={field.name}
                      defaultValue={!!field.value ? field.value : 'unset'}
                      value={!!field.value ? field.value : 'unset'}
                      variant='standard'
                      onChange={(e) => field.onChange(e)}
                    >
                      <MenuItem value='unset' disabled>
                        Chức vụ
                      </MenuItem>
                      {roleName.map((el) => (
                        <MenuItem value={el.value} key={el.value}>
                          {el.label}
                        </MenuItem>
                      ))}
                    </Select>
                  );
                }}
              />
              <FormHelperText error={Boolean(!!touchedFields?.role && !!errors?.role?.message)}>
                {!!dirtyFields?.role && !!touchedFields?.role && errors?.role?.message}
              </FormHelperText>
            </InputGroup>
            <CustomInputField
              label='Mật khẩu*:'
              register={register}
              touchedField={touchedFields?.password}
              error={errors?.password}
              dirtyField={dirtyFields?.password}
              name='password'
              type='password'
            />
            <CustomInputField
              label='Nhập lại mật khẩu*:'
              name='confirm_password'
              register={register}
              touchedField={touchedFields?.confirm_password}
              error={errors?.confirm_password}
              dirtyField={dirtyFields?.confirm_password}
              type='password'
            />
          </Grid>
          <Grid item xs={12} md={3} container justifyContent='center'>
            <StaffUploadImage
              label='Ảnh chân dung*:'
              register={register}
              name='avatar_img'
              isAvatar
              initImage={images}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container rowSpacing={3}>
              <Grid item xs={12} md={6} container justifyContent='center'>
                <StaffUploadImage
                  label='Ảnh mặt trước CMND/CCCD*:'
                  register={register}
                  name='id_card_img_1'
                  initImage={images}
                />
              </Grid>
              <Grid item xs={12} md={6} container justifyContent='center'>
                <StaffUploadImage
                  label='Ảnh mặt sau CMND/CCCD*:'
                  register={register}
                  name='id_card_img_2'
                  initImage={images}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction='row' spacing={3} justifyContent='center'>
                  <Button
                    type='button'
                    variant='outlined'
                    onClick={() => navigate(-1)}
                    sx={{width: '200px'}}
                  >
                    Hủy
                  </Button>
                  <LoadingButton
                    type='submit'
                    variant='contained'
                    loading={isSubmitting}
                    sx={{width: '200px'}}
                  >
                    {!!update ? 'Chỉnh sửa' : 'Tạo mới'}
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
};

export default forwardRef(StaffForm);
