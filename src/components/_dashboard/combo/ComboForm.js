import PropTypes from 'prop-types';
import {useLayoutEffect, useState, useCallback} from 'react';
import {Controller, FormProvider} from 'react-hook-form';
import {styled} from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Grid,
  TextField,
  Typography,
  FormGroup,
  // FormControl,
  FormLabel,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useNavigate} from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import {ComboCard} from 'src/components/_dashboard/combo';
import {OrderAddNewProductPopup, OrderProductList} from 'src/components/_dashboard/order';
import {useSnackbar} from 'notistack';
import Scrollbar from 'src/components/Scrollbar';
import Label from 'src/components/Label';

const Input = styled('input')({
  display: 'none',
});

const optionalField = [
  {
    name: 'description',
    label: 'Description',
  },
  {
    name: 'note',
    label: 'Note',
  },
  {
    name: 'tag',
    label: 'Tag',
  },
  {
    name: 'brand',
    label: 'Brand',
  },
  {
    name: 'guide',
    label: 'Hướng dẫn sử dụng',
  },
  {
    name: 'preserve',
    label: 'Hướng dẫn bảo quản',
  },
  {
    name: 'made_in',
    label: 'Made In',
  },
  {
    name: 'made_by',
    label: 'Made By',
  },
  {
    name: 'day_to_shipping',
    label: 'Day to shipping',
  },
];

const ComboForm = ({methods, onSubmit, id, initImage, productList, setProductList}) => {
  const navigate = useNavigate();
  const [imageReview, setImageReview] = useState('');
  const {enqueueSnackbar} = useSnackbar();
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [comboPrice, setComboPrice] = useState({
    price: 0,
    sale_price: 0,
  });
  const [, setStateChanged] = useState(false);
  const [, setErrorPopup] = useState(false);

  // Fix UI
  const fixUI = (id) =>
    id === 'update'
      ? {
          InputLabelProps: {
            shrink: true,
          },
        }
      : {};

  const {
    handleSubmit,
    register,
    watch,
    control,
    setValue,
    formState: {isSubmitting},
  } = methods;
  const data = watch();
  const imageFile = data.image;

  const onError = (data) => {
    Object.keys(data).forEach((key) => {
      enqueueSnackbar(data[key].message, {variant: 'error'});
    });
  };

  // Handle Change Image
  const handleChangeImg = useCallback(
    (imageFile) => {
      let imgURL = initImage;
      if (imageFile && imageFile.length > 0) {
        imgURL = URL.createObjectURL(imageFile[0]);
      }
      setImageReview(imgURL);
      return () => URL.revokeObjectURL(imgURL);
    },
    [initImage]
  );

  // Close Add Product Popup
  const handleClosePopup = () => {
    setShowAddProductPopup(false);
  };

  // Handle set Product value
  const handleSetProductValue = useCallback(
    (productList) => {
      if (productList.length === 0) {
        setValue('products', []);
      } else {
        const tempProduct = productList.map((product) => ({
          id: product.id,
          product_id: product.product_id,
          count: product.count,
        }));
        setValue('products', tempProduct);
      }
    },
    [setValue]
  );

  // Handle Add New Product
  const handleAddNewProduct = useCallback(
    (newProduct) => {
      let tempArrProduct = [...productList];

      // Check if product is already in list
      const isExits = tempArrProduct.findIndex((item) => item.id === newProduct.id);
      if (isExits === 0) {
        // If product is already in list, update quantity
        const productCount = newProduct.count || 1;
        tempArrProduct[isExits] = {
          ...tempArrProduct[isExits],
          count: tempArrProduct[isExits]['count'] + productCount,
        };
      } else {
        // If not, add it to list
        tempArrProduct.push(newProduct);
      }
      setProductList(tempArrProduct);
      setStateChanged(true);
    },
    [productList, setProductList]
  );

  // Handle Set Product Count
  const setProductCount = (id, count) => {
    const tempObject = productList.findIndex((e) => e.id === id);
    let tempArr = [...productList];
    tempArr[tempObject] = {...tempArr[tempObject], count: count};
    setProductList(tempArr);
    setStateChanged(true);
  };

  // Handle Delete Product
  const deleteProduct = (id) => {
    const deleteItem = productList.filter((item) => item.id !== id);
    setProductList(deleteItem);
  };

  // Calculate Price
  const calculatePrice = useCallback(
    (productList) => {
      if (productList?.length > 0) {
        const finalOriginalPrice = productList.reduce(
          (temp, {count, price}) => temp + count * price,
          0
        );
        const finalSalePricePrice = productList.reduce(
          (temp, {count, price_sale}) => temp + count * price_sale,
          0
        );
        setComboPrice({
          total_money: finalOriginalPrice,
          total_money_sale: finalSalePricePrice,
        });
        setValue('total_money', finalOriginalPrice);
        setValue('total_money_sale', finalSalePricePrice);
        if (id === 'add') {
          setValue('recommend_price', finalSalePricePrice);
        }
        // if (id !== 'update') {
        //   setValue('recommend_price', finalSalePricePrice);
        // }
      }
      return () => null;
    },
    [setValue, id]
  );

  useLayoutEffect(() => {
    // Check initImage
    if (initImage) {
      setImageReview(initImage);
    }

    // Check productList
    handleSetProductValue(productList);
    // Re-render after upload image
    handleChangeImg(imageFile);

    // Clean effect
    return () => null;
  }, [initImage, productList, handleChangeImg, handleSetProductValue, imageFile, setValue]);

  // Update Price while update ProductList
  useLayoutEffect(() => {
    calculatePrice(productList);
  }, [calculatePrice, productList]);

  return (
    <>
      <Card variant="outlined">
        <Scrollbar sx={{maxHeight: '65vh'}}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Stack direction="row" justifyContent="center" sx={{mb: 3}}>
                  <Typography variant="h6">Thông tin combo</Typography>
                </Stack>
                <FormProvider {...methods}>
                  <Box
                    component="form"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit, onError)}
                    // onChange={handleChangeImg}
                    id={`combo_form_${!!id ? id : 'default'}`}
                  >
                    <Stack spacing={3}>
                      <TextField
                        label="Tên combo"
                        autoFocus
                        {...register('name')}
                        fullWidth
                        {...fixUI(id)}
                      />
                      <TextField
                        label="Chi tiết"
                        {...register('detail')}
                        type="text"
                        fullWidth
                        multiline
                        minRows={4}
                        {...fixUI(id)}
                      />

                      <Stack direction="row" spacing={2}>
                        <Stack spacing={3}>
                          <TextField
                            label="Giá gốc"
                            {...register('total_money')}
                            fullWidth
                            InputProps={{
                              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="tel"
                            disabled
                          />
                          <TextField
                            label="Giá bán"
                            {...register('total_money_sale')}
                            fullWidth
                            InputProps={{
                              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="tel"
                            disabled
                          />
                        </Stack>
                        <Stack>
                          <TextField
                            size="large"
                            label="Giá bán đề nghị cho combo"
                            {...register('recommend_price')}
                            fullWidth
                            helperText="Bạn có thể bỏ qua trường này"
                            InputProps={{
                              endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type="tel"
                          />
                        </Stack>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <FormGroup row sx={{alignItems: 'center', gap: 3}}>
                          <FormLabel>Trạng thái: </FormLabel>
                          <FormControlLabel
                            control={
                              <Controller
                                name="is_active"
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
                              data?.is_active ? (
                                <Label color="success">Đang hoạt động</Label>
                              ) : (
                                <Label color="error">Tạm ngừng bán</Label>
                              )
                            }
                          />
                        </FormGroup>
                        <label
                          htmlFor="code_image"
                          style={{width: 'fit-content', marginLeft: 'auto'}}
                        >
                          <Input
                            type="file"
                            id="code_image"
                            {...register('image')}
                            accept="image/*"
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
                    </Stack>
                  </Box>
                </FormProvider>
              </Grid>
              <Grid item xs={12} md={5}>
                <Stack direction="row" justifyContent="center" sx={{mb: 3}}>
                  <Typography variant="h6">Review</Typography>
                </Stack>
                <Stack direction="row" justifyContent="center">
                  <ComboCard
                    data={data}
                    comboPrice={comboPrice}
                    image={imageReview}
                    type="review"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" sx={{my: 2}}>
                  <Typography variant="h6">Chọn sản phẩm cho combo:</Typography>
                  <Button
                    size="small"
                    type="button"
                    variant="contained"
                    color="warning"
                    onClick={() => setShowAddProductPopup(true)}
                    startIcon={<AddIcon />}
                  >
                    Thêm sản phẩm mới
                  </Button>
                </Stack>
                <Stack>
                  <OrderProductList
                    productList={productList}
                    deleteProduct={deleteProduct}
                    setProductCount={setProductCount}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sx={{mb: 3}}>
                {/* Optinal Fields */}
                <Typography variant="h5" align='center' gutterBottom>Thông tin khác</Typography>
                <Stack spacing={3}>
                  {optionalField.map((field) => (
                    <TextField
                      {...fixUI(id)}
                      {...register(field.name)}
                      label={field.label}
                      multiline
                      minRows={4}
                      fullWidth
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Scrollbar>
        <CardActions sx={{justifyContent: 'center', gap: 3, py: 2}}>
          <Button
            sx={{width: '200px'}}
            color="error"
            onClick={() => navigate(-1, {replace: true})}
            variant="contained"
            startIcon={<CancelIcon />}
          >
            Hủy
          </Button>
          <LoadingButton
            sx={{width: '200px'}}
            loading={isSubmitting}
            type="submit"
            form={`combo_form_${!!id ? id : 'default'}`}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            disabled={productList.length === 0}
          >
            {id !== 'update' ? 'Tạo combo mới' : 'Lưu lại'}
          </LoadingButton>
        </CardActions>
      </Card>

      <OrderAddNewProductPopup
        open={showAddProductPopup}
        handleClose={handleClosePopup}
        handleAddNewProduct={handleAddNewProduct}
        setErrorPopup={setErrorPopup}
      />
    </>
  );
};

ComboForm.propTypes = {
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  id: PropTypes.string,
  initImage: PropTypes.string,
};

export default ComboForm;
