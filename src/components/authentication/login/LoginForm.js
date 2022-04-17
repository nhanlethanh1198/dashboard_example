import * as Yup from 'yup';
import {useState, useCallback} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {FormProvider, useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Icon} from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import {instance} from 'src/api/instance';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
import {useSnackbar} from 'notistack';
import {LoadingButton} from '@mui/lab';
// import data from '@iconify/icons-eva/menu-2-fill';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  const LoginSchema = Yup.object().shape({
    phone: Yup.string()
      .length(10, 'Số điện thoại phải bao gồm 10 chữ số')
      .required('Số điện thoại là bắt buộc'),
    password: Yup.string().required('Mật khẩu là bắt buộc'),
  });

  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      phone: '',
      password: '',
      remember: true,
    },
  });

  const {
    control, register, handleSubmit, formState: {touchedFields, isSubmitting, errors},
  } = methods;


  const onSubmit = useCallback(async (values) => {
    try {
      const req = {
        phone: values.phone,
        password: values.password,
      };
      const response = await instance.post('/staffs/staff-login', req);

      if (response.status === 200) {

        const access_token = response.data.access_token;
        const token_type = response.data.token_type;
        // set instance request
        instance.interceptors.request.use(function(config) {
          config.headers.Authorization = `${token_type} ${access_token}`;
          return config;
        });
        // set instance response
        instance.interceptors.response.use(
          response => {
            return response;
          },
          error => {
            if (error.response.status === 401) {
              enqueueSnackbar('Phiên đăng nhập đã hết hạn!', {variant: 'error'});
              window.localStorage.clear();
              navigate('/login', {replace: true});
            }
            return Promise.reject(error);
          });

        // Get staff info
        const info = await instance.get('/staffs/get-staff-info');
        const data = info.data.data;
        const staff_info = {
          staff_id: data.id,
          fullname: data.fullname,
          email: data.email,
          avartar_image: data.avatar_img,
          address: data.address,
          phone: data.phone,
        };

        // Check if remember me to store token
        if (values.remember) {
          window.localStorage.setItem('token_type', token_type);
          window.localStorage.setItem('access_token', access_token);
          window.localStorage.setItem('staff_info', JSON.stringify(staff_info));
        }

        navigate('/dashboard/app', {replace: true});

      }
    } catch (error) {
      console.log(error)
      enqueueSnackbar(error.response.data.detail, {
        variant: 'error'
      });
    }
  }, [navigate, enqueueSnackbar]);

  const onError = error => {
    return;
  };


  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };


  return (
    <FormProvider {...methods}>
      <form autoComplete='off' noValidate onSubmit={handleSubmit(onSubmit, onError)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete='username'
            type='text'
            label='Số điện thoại'
            {...register('phone')}
            error={Boolean(touchedFields.phone && !!errors.phone?.message)}
            helperText={touchedFields.phone && errors.phone?.message}
          />

          <TextField
            fullWidth
            autoComplete='current-password'
            type={showPassword ? 'text' : 'password'}
            label='Mật khẩu'
            {...register('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleShowPassword} edge='end'>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touchedFields.password && !!errors.password?.message)}
            helperText={touchedFields.password && errors.password?.message}
          />
        </Stack>

        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={{my: 2}}
        >
          <Controller
            name={'remember'}
            control={control}
            render={({field}) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    name={field.name}
                  />
                }
                label='Ghi nhớ'
              />
            )}
          />

          <Link component={RouterLink} variant='subtitle2' to='#'>
            Quên mật khẩu?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size='large'
          type='submit'
          variant='contained'
          loading={isSubmitting}
        >
          Đăng nhập
        </LoadingButton>
      </form>
    </FormProvider>
  );
}
