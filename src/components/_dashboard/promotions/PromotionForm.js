import {FormProvider, Controller} from 'react-hook-form';
import {
  Box,
  Stack,
  FormGroup,
  FormControlLabel,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  FormControl,
  InputLabel,
  Switch,
  Select,
  MenuItem,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {styled} from '@mui/material/styles';
import CustomDateTimePicker from 'src/components/CustomDateTimePicker';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import {useNavigate} from 'react-router-dom';
import {PromotionCard} from '.';
import Label from 'src/components/Label';
import Scrollbar from 'src/components/Scrollbar';
import {useState, useLayoutEffect, useCallback} from 'react';

const Input = styled(TextField)({
  display: 'none',
});

const PromotionForm = ({methods, id, onSubmit, initImage}) => {
  const navigate = useNavigate();
  const [imageReview, setImageReview] = useState('');
  const onError = (data) => {
    console.error(data);
  };

  const {
    control,
    register,
    formState: {errors, isSubmitting},
    watch,
    // getValues,
  } = methods;

  // const configTextField = (name, label) => ({
  //   register: {...register(name)},
  //   error: errors[name]?.message,
  //   label: label,
  // });

  const data = watch();
  useLayoutEffect(() => {
    setImageReview(initImage);
  }, [initImage, setImageReview]);

  const handleChangeImg = useCallback(
    (e) => {
      const {name, files} = e.target;
      let imgURL = null;
      if (name === 'image') {
        imgURL = URL.createObjectURL(files[0]);
        setImageReview(imgURL);
      }
      // Clean up memory after image loaded
      return () => URL.revokeObjectURL(imgURL);
    },
    [setImageReview]
  );

  // fix Label isShrink
  const isShrink = () => (id === 'update' ? {InputLabelProps: {shrink: true}} : {});

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        id={`promo_form_${!!id ? id : 'default'}`}
        onChange={handleChangeImg}
      >
        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Scrollbar sx={{maxHeight: '50vh'}}>
                  <Stack direction="row" justifyContent="center" sx={{mb: 4}}>
                    <Typography variant="h6">Thông tin mã khuyến mãi</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <TextField
                      label="Tiêu đề"
                      {...register('title')}
                      type="text"
                      fullWidth
                      autoFocus
                      error={!!errors?.title?.message}
                      helperText={errors?.title?.message}
                      {...isShrink()}
                    />
                    <TextField
                      label="Mã Code khuyến mại"
                      {...register('code')}
                      {...isShrink()}
                      type="text"
                      fullWidth
                      error={!!errors?.code?.message}
                      helperText={errors?.code?.message}
                    />
                    <TextField
                      label="Chi tiết"
                      {...register('detail')}
                      type="text"
                      fullWidth
                      error={!!errors?.detail?.message}
                      helperText={errors?.detail?.message}
                      {...isShrink()}
                      multiline
                      minRows={4}
                    />
                    <TextField
                      label="Rule"
                      {...register('rule')}
                      type="text"
                      fullWidth
                      error={!!errors?.rule?.message}
                      helperText={errors?.rule?.message}
                      {...isShrink()}
                      multiline
                      minRows={2}
                    />
                    <Controller
                      control={control}
                      name="promotion_type"
                      defaultValue={data.promotion_type || 'system'}
                      render={({field}) => (
                        <FormControl>
                          <InputLabel id="promorion_type_selector">
                            Phân loại mã khuyến mãi
                          </InputLabel>
                          <Select
                            labelId="promorion_type_selector"
                            label="Phân loại mã khuyến mãi"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          >
                            <MenuItem value="system">Áp dụng cho toàn bộ hệ thống</MenuItem>
                            <MenuItem value="user">Chỉ riêng người dùng</MenuItem>
                            <MenuItem value="order">Voucher cho đơn hàng</MenuItem>
                            <MenuItem value="task">Voucher cho tất cả công việc</MenuItem>
                            <MenuItem value="odd-shift">Voucher cho công việc ca lẻ</MenuItem>
                            <MenuItem value="fixed-shift">Voucher cho công việc ca cố định</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                    <Stack direction="row" justifyContent="space-between">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Controller
                              name="is_active"
                              control={control}
                              render={({field}) => (
                                <Switch
                                  checked={field.value || false}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                />
                              )}
                            />
                          }
                          label={
                            data?.is_active ? (
                              <Label color="primary">Đang hoạt động</Label>
                            ) : (
                              <Label color="error">Đã khóa</Label>
                            )
                          }
                        />
                      </FormGroup>
                      <label htmlFor="code_image" style={{width: 'fit-content'}}>
                        <Input
                          type="file"
                          id="code_image"
                          accept="image/*"
                          {...register('image')}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          startIcon={<FileUploadIcon />}
                        >
                          Tải ảnh lên
                        </Button>
                      </label>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <CustomDateTimePicker
                        control={control}
                        name="time_from"
                        label="Thời gian bắt đầu"
                      />
                      <CustomDateTimePicker
                        control={control}
                        name="time_to"
                        label="Thời gian kết thúc"
                      />
                    </Stack>
                  </Stack>
                </Scrollbar>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="column" spacing={4}>
                  <Stack direction="row" justifyContent="center">
                    <Typography variant="h6">Review</Typography>
                  </Stack>
                  <Grid container>
                    <PromotionCard data={data} image={imageReview} type="review" />
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{justifyContent: 'center', gap: 3, mb: 1}}>
            <Button
              sx={{width: '150px'}}
              color="error"
              onClick={() => navigate(-1)}
              variant="contained"
              startIcon={<CancelIcon />}
            >
              Hủy
            </Button>
            <LoadingButton
              sx={{width: '150px'}}
              type="submit"
              form={`promo_form_${!!id ? id : 'default'}`}
              variant="contained"
              loading={isSubmitting}
              startIcon={<CheckCircleOutlineOutlinedIcon />}
            >
              {initImage ? 'Lưu' : 'Thêm mới'}
            </LoadingButton>
          </CardActions>
        </Card>
      </Box>
    </FormProvider>
  );
};

export default PromotionForm;
