import {FormProvider, Controller} from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
  Stack,
  Select,
  Typography,
  MenuItem,
  Avatar,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';
import {useCallback, useLayoutEffect, useState} from 'react';
import {BannerCard} from '.';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import {styled} from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Label from 'src/components/Label';
import {deleteBannerById} from 'src/api/banner';

const Input = styled('input')({
  display: 'none',
});

const BannerForm = ({methods, id, onSubmit, initImage, categories, banner_id}) => {
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const {
    register,
    formState: {errors, isSubmitting},
    handleSubmit,
    watch,
    control,
  } = methods;

  useLayoutEffect(() => {
    if (initImage) {
      setImage(initImage);
    }
  }, [setImage, initImage]);

  const item = watch();

  const onError = (data) => {
    Object.keys(data).forEach((key) => {
      enqueueSnackbar(data[key]?.message, {variant: 'error'});
    });
  };

  const handleChange = useCallback(
    (event) => {
      const {name, files} = event.target;
      let imgURL = initImage;
      if (name === 'image') {
        imgURL = URL.createObjectURL(files[0]);
      }
      setImage(imgURL);
      return () => URL.revokeObjectURL(imgURL);
    },
    [setImage, initImage]
  );

  const deleteBanner = async (banner_id) =>
    await deleteBannerById(banner_id)
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar('Xóa banner thành công!', {variant: 'success'});
          navigate('/dashboard/banners');
        }
      })
      .catch((err) => {
        console.error(err.message);
        enqueueSnackbar(err.message, {variant: 'error'});
      });

  return (
    <Card>
      <CardContent>
        <FormProvider {...methods}>
          <Box
            id={`banner_form_${!!id ? id : 'default'}`}
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit, onError)}
            onChange={handleChange}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Stack gap={3}>
                  <TextField
                    {...register('title')}
                    label="Tiêu đề"
                    error={!!errors?.title?.message}
                    helperText={errors?.title?.message}
                    InputLabelProps={{shrink: id === 'update' ? true : 'auto'}}
                  />

                  <Controller
                    name="category_id"
                    control={control}
                    defaultValue={0}
                    render={({field}) => (
                      <Select
                        {...field}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected) {
                            return <Typography variant="body1">Chọn danh mục</Typography>;
                          } else {
                            const category = categories.find((c) => c.id === selected);
                            return (
                              <Stack direction="row" sx={{pl: 1, gap: 1}}>
                                <Avatar
                                  imgProps={{loading: 'eager'}}
                                  src={category.image}
                                  alt={category.name}
                                  sx={{width: 25, height: 25}}
                                />
                                {category.name} ({`${category.id}`})
                              </Stack>
                            );
                          }
                        }}
                      >
                        <MenuItem value={0}>Không có danh mục cha</MenuItem>
                        {categories &&
                          categories.map((item, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={parseInt(item.id)}
                                sx={{display: 'flex', gap: 2}}
                              >
                                <Avatar
                                  imgProps={{loading: 'eager'}}
                                  src={item.image}
                                  alt={item.name}
                                  sx={{width: 25, height: 25}}
                                />
                                {item.name} ({`${item.id}`})
                              </MenuItem>
                            );
                          })}
                      </Select>
                    )}
                  />

                  <Stack
                    direction="row"
                    justifyContent={id === 'update' ? 'space-between' : 'flex-start'}
                  >
                    {id === 'update' && (
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
                            item?.is_active ? (
                              <Label color="primary">Bật</Label>
                            ) : (
                              <Label color="error">Tắt</Label>
                            )
                          }
                        />
                      </FormGroup>
                    )}
                    <label htmlFor="banner_image_uploader">
                      <Input
                        {...register('image')}
                        id="banner_image_uploader"
                        type="file"
                        accept="image/*"
                      />
                      <Button variant="contained" component="span" startIcon={<FileUploadIcon />}>
                        Tải ảnh lên
                      </Button>
                    </label>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <BannerCard item={item} image={image} />
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </CardContent>
      <CardActions sx={{justifyContent: 'center', gap: 3, mb: 2}}>
        <Button
          sx={{width: '150px'}}
          // color="error"
          onClick={() => navigate(-1)}
          variant="contained"
          startIcon={<CancelIcon />}
          color={id === 'update' ? 'secondary' : 'error'}
        >
          Hủy
        </Button>
        <LoadingButton
          sx={{width: '150px'}}
          type="submit"
          form={`banner_form_${!!id ? id : 'default'}`}
          variant="contained"
          loading={isSubmitting}
          startIcon={<CheckCircleOutlineOutlinedIcon />}
        >
          {id === 'update' ? 'Lưu' : 'Tạo mới'}
        </LoadingButton>
        {id === 'update' && (
          <LoadingButton
            sx={{width: '150px'}}
            type="button"
            form={`banner_form_${!!id ? id : 'default'}`}
            variant="contained"
            // loading={isSubmitting}
            color="error"
            onClick={() => deleteBanner(banner_id)}
            startIcon={<DeleteIcon />}
          >
            Xóa Banner
          </LoadingButton>
        )}
      </CardActions>
    </Card>
  );
};

export default BannerForm;
