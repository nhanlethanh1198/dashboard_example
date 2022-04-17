import {useEffect, useCallback, useState} from 'react';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {FormProvider, Controller} from 'react-hook-form';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
  Select,
  Stack,
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  CardMedia,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {LoadingButton} from '@mui/lab';
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import UploadIcon from '@mui/icons-material/Upload';

// api
import {getListCategory} from 'src/api/categories';

const CategoryForm = ({methods, onSubmit, initImage, id}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [image, setImage] = useState('');
  const {setListCategory} = useStoreActions((actions) => actions.categories);
  const {categories} = useStoreState((states) => states.categories);

  //
  const checkInitImage = useCallback(
    (initImage) => {
      if (id === 'update' && initImage) {
        setImage(initImage);
      }
    },
    [id]
  );

  //   Check categories has data
  const handleGetCategories = useCallback(async () => {
    if (categories?.length === 0) {
      await getListCategory()
        .then((res) => {
          if (res.status === 200) {
            const {data} = res.data;
            setListCategory(data);
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, {variant: 'error'});
          enqueueSnackbar('Không tải được danh sách danh mục, vui lòng thử lại', {
            variant: 'error',
          });
        });
    }
    return () => {};
  }, [enqueueSnackbar, categories, setListCategory]);

  useEffect(() => {
    handleGetCategories();
    checkInitImage(initImage);
    return () => {};
  }, [handleGetCategories, checkInitImage, initImage]);

  const {
    handleSubmit,
    control,
    register,
    getValues,
    setValue,
    formState: {errors, isSubmitting},
  } = methods;

  const defaultParentId = getValues('parent_id');

  // Handle Review Image
  const handleReviewImage = useCallback(
    (e) => {
      let imgURL = null;
      if (e.target.files[0]) {
        setValue('img', e.target.files);
        imgURL = URL.createObjectURL(e.target.files[0]);
        setImage(imgURL);
      }
      return () => URL.revokeObjectURL(imgURL);
    },
    [setValue]
  );

  const onError = (data) => {
    console.error(data);
    Object.keys(errors).forEach((key) => {
      enqueueSnackbar(errors[key].message, {variant: 'error'});
    });
  };

  //   Fix label is Overlay
  const fixLabelOverlay = () =>
    id === 'update'
      ? {
          InputLabelProps: {
            shrink: true,
          },
        }
      : {};

  return (
    <Card>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} id={`${id}_category_form`}>
            <Grid container rowSpacing={3} columnSpacing={4}>
              <Grid item xs={12} md={8} container alignItems="center">
                <TextField
                  type="text"
                  autoFocus
                  label="Tên danh mục"
                  {...register('name')}
                  fullWidth
                  helperText={errors?.name?.message}
                  {...fixLabelOverlay()}
                  sx={{mb: matches ? 0 : 3}}
                />
                <Controller
                  name="parent_id"
                  control={control}
                  defaultValue={defaultParentId || 0}
                  render={({field, fieldState: {error}}) => (
                    <FormControl fullWidth>
                      <InputLabel id="select_parent_category">Chọn danh mục cha</InputLabel>
                      <Select
                        labelId="select_parent_category"
                        label="Chọn danh mục cha"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        renderValue={(value) => {
                          if (value === 0) {
                            return 'Không chọn danh mục cha';
                          } else {
                            const selectedCategory = categories.find(
                              (category) => category.id === value
                            );
                            return (
                              <Stack direction="row" sx={{pl: 1, gap: 1}}>
                                <Avatar
                                  imgProps={{loading: 'eager'}}
                                  src={selectedCategory.image}
                                  alt={selectedCategory.name}
                                  sx={{width: 25, height: 25}}
                                />
                                {selectedCategory.name} ({`${selectedCategory.id}`})
                              </Stack>
                            );
                          }
                        }}
                      >
                        <MenuItem value={0}>Không chọn danh mục</MenuItem>
                        {categories?.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            <Avatar
                              imgProps={{loading: 'eager'}}
                              src={category.image}
                              alt={category.name}
                              sx={{width: 25, height: 25}}
                            />
                            {category.name} ({`${category.id}`})
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error={!!error}>{error}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4} container justifyContent="center">
                <Stack justifyContent="center" alignItems="center" spacing={3}>
                  <Typography variant="h6">Ảnh danh mục</Typography>
                  <Card>
                    <CardMedia
                      component="img"
                      src={
                        image ||
                        'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
                      }
                      height="200"
                      width="auto"
                    />
                  </Card>

                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register('img')}
                      style={{display: 'none'}}
                      onChange={handleReviewImage}
                    />
                    <Button
                      component="span"
                      color={image ? 'warning' : 'primary'}
                      variant="contained"
                      startIcon={<UploadIcon />}
                    >
                      {image ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                    </Button>
                  </label>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </CardContent>
      <CardActions sx={{justifyContent: 'center', gap: 3, mb: 2}}>
        <Button
          sx={{width: '150px'}}
          // color="error"
          onClick={() => navigate(-1, {replace: true})}
          variant="contained"
          startIcon={<CancelIcon />}
          color={id === 'update' ? 'secondary' : 'error'}
        >
          Hủy
        </Button>
        <LoadingButton
          sx={{width: '150px'}}
          type="submit"
          form={`${id}_category_form`}
          variant="contained"
          loading={isSubmitting}
          startIcon={<CheckCircleOutlineOutlinedIcon />}
        >
          {id === 'update' ? 'Lưu' : 'Tạo mới'}
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

CategoryForm.defaultProps = {
  id: 'add',
};

export default CategoryForm;
