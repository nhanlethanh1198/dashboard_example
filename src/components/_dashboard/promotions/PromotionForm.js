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
                    <Typography variant="h6">Th??ng tin m?? khuy???n m??i</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <TextField
                      label="Ti??u ?????"
                      {...register('title')}
                      type="text"
                      fullWidth
                      autoFocus
                      error={!!errors?.title?.message}
                      helperText={errors?.title?.message}
                      {...isShrink()}
                    />
                    <TextField
                      label="M?? Code khuy???n m???i"
                      {...register('code')}
                      {...isShrink()}
                      type="text"
                      fullWidth
                      error={!!errors?.code?.message}
                      helperText={errors?.code?.message}
                    />
                    <TextField
                      label="Chi ti???t"
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
                            Ph??n lo???i m?? khuy???n m??i
                          </InputLabel>
                          <Select
                            labelId="promorion_type_selector"
                            label="Ph??n lo???i m?? khuy???n m??i"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          >
                            <MenuItem value="system">??p d???ng cho to??n b??? h??? th???ng</MenuItem>
                            <MenuItem value="user">Ch??? ri??ng ng?????i d??ng</MenuItem>
                            <MenuItem value="order">Voucher cho ????n h??ng</MenuItem>
                            <MenuItem value="task">Voucher cho t???t c??? c??ng vi???c</MenuItem>
                            <MenuItem value="odd-shift">Voucher cho c??ng vi???c ca l???</MenuItem>
                            <MenuItem value="fixed-shift">Voucher cho c??ng vi???c ca c??? ?????nh</MenuItem>
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
                              <Label color="primary">??ang ho???t ?????ng</Label>
                            ) : (
                              <Label color="error">???? kh??a</Label>
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
                          T???i ???nh l??n
                        </Button>
                      </label>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <CustomDateTimePicker
                        control={control}
                        name="time_from"
                        label="Th???i gian b???t ?????u"
                      />
                      <CustomDateTimePicker
                        control={control}
                        name="time_to"
                        label="Th???i gian k???t th??c"
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
              H???y
            </Button>
            <LoadingButton
              sx={{width: '150px'}}
              type="submit"
              form={`promo_form_${!!id ? id : 'default'}`}
              variant="contained"
              loading={isSubmitting}
              startIcon={<CheckCircleOutlineOutlinedIcon />}
            >
              {initImage ? 'L??u' : 'Th??m m???i'}
            </LoadingButton>
          </CardActions>
        </Card>
      </Box>
    </FormProvider>
  );
};

export default PromotionForm;
