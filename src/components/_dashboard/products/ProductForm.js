import {useEffect, useCallback} from 'react';
import {FormProvider, Controller} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {
  Card,
  CardActions,
  Stack,
  TextField,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  InputLabel,
  InputAdornment,
  FormHelperText,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {ProductImagePicker, SelectProductStore, SelectCategoriesWithChip} from '.';
import {LoadingButton} from '@mui/lab';
import {useSnackbar} from 'notistack';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {getProvinces} from 'src/api/location';
import Scrollbar from 'src/components/Scrollbar';
import Label from 'src/components/Label';

const ProductForm = ({methods, id, onSubmit, images}) => {
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const {locations} = useStoreState((state) => state.location);
  const setLocations = useStoreActions((actions) => actions.location.setLocations);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: {errors, isSubmitting},
  } = methods;

  const getProvincesList = useCallback(async () => {
    // Check location is empty
    if (locations && locations.length > 0) {
      return;
    }
    // Get provinces list
    await getProvinces()
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.error, {variant: 'error'});
      });
  }, [enqueueSnackbar, setLocations, locations]);

  const defaultLocation = watch('location');
  const defaultUnit = watch('unit');
  const defaultStore = watch('belong_to_store');
  const isShowOnHomePage = watch('is_show_on_homepage');
  const isShowOnStore = watch('is_show_on_store');
  const isShowOnCombo = watch('is_show_on_combo');

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

  const onError = (data) => {
    Object.keys(data).forEach((key) => {
      enqueueSnackbar(data[key].message, {variant: 'error'});
    });
  };

  useEffect(() => {
    getProvincesList();
    return () => {};
  }, [getProvincesList]);


  return (
    <Card sx={{p: 2}}>
      <Scrollbar sx={{maxHeight: '65vh', p: 1}}>
        <Typography variant="h5" component="h2" align="center">
          Th??ng tin s???n ph???m
        </Typography>
        <Typography variant="subtitle2" align="center" gutterBottom>
          Ghi ch??: C??c tr?????ng c?? g???n d???u * l?? b???t bu???c
        </Typography>
        <FormProvider {...methods}>
          <form
            encType="multipart/form-data"
            onSubmit={handleSubmit(onSubmit, onError)}
            autoComplete="off"
            id={`product-form-${id || 'default'}`}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('name')}
                      label="T??n s???n ph???m*"
                      fullWidth
                      autoFocus
                      error={!!errors?.name?.message}
                      helperText={errors?.name?.message || 'Th??ng tin n??y l?? b???t bu???c'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="belong_to_store"
                      control={control}
                      defaultValue={defaultStore || 0}
                      render={({field, fieldState: {error}}) => (
                        <SelectProductStore
                          value={field.value}
                          onChange={field.onChange}
                          label="Nh?? cung c???p s???n ph???m*"
                          error={error?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="category_id"
                      control={control}
                      defaultValue={0}
                      render={({field, fieldState: {error}}) => (
                        <SelectCategoriesWithChip
                          value={field.value}
                          onChange={field.onChange}
                          label="Danh m???c*"
                          error={error?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="location"
                      control={control}
                      defaultValue={defaultLocation}
                      render={({field}) => (
                        <FormControl fullWidth>
                          <InputLabel id="location-label">Khu v???c*</InputLabel>
                          <Select
                            labelId="location-label"
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            label="Khu v???c*"
                          >
                            <MenuItem value={0}>Kh??ng ch???n</MenuItem>
                            {locations?.map(location => (
                              <MenuItem key={location.code} value={location.code}>{location.fullname}</MenuItem>
                            ))}
                          </Select>
                          <FormHelperText error={!!errors?.location?.message}>
                            {errors?.location?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Typography variant="h6" align="center" gutterBottom>
                  Ch??? ????? hi???n th???
                </Typography>
                <FormGroup row sx={{justifyContent: 'space-between'}}>
                  <FormLabel color={isShowOnHomePage ? 'primary' : 'error'} focused>
                    Hi???n th??? ??? trang ch???:{' '}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Controller
                        name="is_show_on_homepage"
                        control={control}
                        render={({field}) => {
                          return (
                            <Switch
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          );
                        }}
                      />
                    }
                    label={
                      isShowOnHomePage ? (
                        <Label color="success">B???t</Label>
                      ) : (
                        <Label color="error">T???t</Label>
                      )
                    }
                  />
                </FormGroup>
                <FormGroup row sx={{justifyContent: 'space-between'}}>
                  <FormLabel color={isShowOnStore ? 'primary' : 'error'} focused>
                    Hi???n th??? trong c???a h??ng:{' '}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Controller
                        name="is_show_on_store"
                        control={control}
                        render={({field}) => {
                          return (
                            <Switch
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          );
                        }}
                      />
                    }
                    label={
                      isShowOnStore ? (
                        <Label color="success">B???t</Label>
                      ) : (
                        <Label color="error">T???t</Label>
                      )
                    }
                  />
                </FormGroup>
                <FormGroup row sx={{justifyContent: 'space-between'}}>
                  <FormLabel color={isShowOnCombo ? 'primary' : 'error'} focused>
                    Hi???n th??? trong danh s??ch combo:{' '}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Controller
                        name="is_show_on_combo"
                        control={control}
                        render={({field}) => {
                          return (
                            <Switch
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          );
                        }}
                      />
                    }
                    label={
                      isShowOnCombo ? (
                        <Label color="success">B???t</Label>
                      ) : (
                        <Label color="error">T???t</Label>
                      )
                    }
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" align="center" gutterBottom>
                  Gi?? b??n s???n ph???m
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={2}>
                    <Controller
                      control={control}
                      name="unit"
                      defaultValue={defaultUnit}
                      render={({field}) => (
                        <FormControl fullWidth>
                          <InputLabel id="unit-label">????n v???*</InputLabel>
                          <Select
                            labelId="unit-label"
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            label="????n v???*"
                          >
                            <MenuItem value="kg">Kg</MenuItem>
                            <MenuItem value="gram">Gram</MenuItem>
                            <MenuItem value="th??ng">Th??ng</MenuItem>
                            <MenuItem value="h???p">H???p</MenuItem>
                            <MenuItem value="b??">B??</MenuItem>
                            <MenuItem value="v???">V???</MenuItem>
                            <MenuItem value="qu???">Qu???</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('weight')}
                      type="tel"
                      label="Kh???i l?????ng*"
                      onWheel={(e) => e.target.blur()}
                      error={!!errors?.name?.weight}
                      helperText={errors?.name?.weight}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">{defaultUnit}</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('stock')}
                      label="T???n kho*"
                      type="tel"
                      onWheel={(e) => e.target.blur()}
                      error={!!errors?.name?.stock}
                      helperText={errors?.name?.stock}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('price')}
                      type="string"
                      label="Gi??*"
                      onWheel={(e) => e.target.blur()}
                      error={!!errors?.name?.price}
                      helperText={errors?.name?.price}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">??</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('price_sale')}
                      type="number"
                      label="Gi?? sale"
                      onWheel={(e) => e.target.blur()}
                      error={!!errors?.name?.price_sale}
                      helperText={errors?.name?.price_sale}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">??</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12} sx={{mb: 3}}>
                    <Typography variant="h6" align="center">
                      ???nh s???n ph???m
                    </Typography>
                    <Typography variant="subtitle2" align="center" gutterBottom>
                      Ghi ch??: ???nh ?????i di???n l?? b???t bu???c.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" alignItems="center" justifyContent="center">
                      <ProductImagePicker
                        name="avatar_img"
                        header="???nh ?????i di???n*"
                        sx={{width: 300, height: 300}}
                        initImage={images?.avatar_img}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid container rowSpacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6" align="center">
                          C??c ???nh kh??c
                        </Typography>
                      </Grid>
                      {[1, 2, 3, 4].map((item, index) => (
                        <Grid key={item} item xs={12} md={6}>
                          <Stack direction="row" justifyContent="center" alignItems="center">
                            <ProductImagePicker
                              name={`image_${item}`}
                              sx={{width: 200, height: 200}}
                              initImage={images?.image_list[index]?.url}
                            />
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" align="center">
                      C??c th??ng tin kh??c
                    </Typography>
                    <Typography variant="subtitle2" align="center" gutterBottom>
                      Ph???n th??ng tin n??y kh??ng b???t bu???c.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('description')}
                      label="M?? t???"
                      error={!!errors?.description?.message}
                      helperText={errors?.description?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('note')}
                      label="Ghi ch??"
                      error={!!errors?.note?.message}
                      helperText={errors?.note?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('tag')}
                      label="Tag"
                      error={!!errors?.tag?.message}
                      helperText={errors?.tag?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('brand')}
                      label="Brand"
                      error={!!errors?.brand?.message}
                      helperText={errors?.brand?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('guide')}
                      label="H?????ng d???n s??? d???ng"
                      error={!!errors?.guide?.message}
                      helperText={errors?.guide?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('preserve')}
                      label="H?????ng d???n b???o qu???n"
                      error={!!errors?.preserve?.message}
                      helperText={errors?.preserve?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('made_in')}
                      label="Made in"
                      error={!!errors?.made_in?.message}
                      helperText={errors?.made_in?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('made_by')}
                      label="Made by"
                      error={!!errors?.made_by?.message}
                      helperText={errors?.made_by?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...isShrinkTextField()}
                      {...register('day_to_shipping')}
                      label="Day to shipping"
                      error={!!errors?.day_to_shipping?.message}
                      helperText={errors?.day_to_shipping?.message}
                      multiline
                      minRows={3}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Scrollbar>
      <CardActions sx={{justifyContent: 'center', gap: 3, mb: 2}}>
        <Button
          sx={{width: '150px'}}
          // color="error"
          onClick={() => navigate(-1, {replace: true})}
          variant="contained"
          startIcon={<CancelIcon />}
          color={id === 'update' ? 'secondary' : 'error'}
        >
          H???y
        </Button>
        <LoadingButton
          sx={{width: '150px'}}
          type="submit"
          form={`product-form-${id || 'default'}`}
          variant="contained"
          loading={isSubmitting}
          startIcon={<CheckCircleOutlineOutlinedIcon />}
        >
          {id === 'update' ? 'L??u' : 'T???o m???i'}
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default ProductForm;
