import {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Container, Typography, Stack, Collapse} from '@mui/material';
import Page from 'src/components/Page';
import {ProductForm} from 'src/components/_dashboard/products';
import {useNavigate, useParams} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {getProductByCode, putProductForUpdate} from 'src/api/products';

const UpdateProductDemo = () => {
  const {code} = useParams();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({
    avatar_img: '',
    image_list: [],
  });

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      unit: 'kg',
      weight: 1,
      price: 10000,
      stock: 100,
      location: 'null',
    },
  });

  const {setValue} = methods;

  // Set Field Value
  const setFieldsValue = useCallback(
    (data) => {
      const requiredFields = [
        'name',
        'unit',
        'weight',
        'price',
        'stock',
        'category_id',
        'belong_to_store',
        'is_show_on_homepage',
        'is_show_on_store',
        'is_show_on_combo'
      ];
      const optionalFields = [
        'location',
        'price_sale',
        'description',
        'note',
        'tag',
        'brand',
        'guide',
        'preserve',
        'made_in',
        'made_by',
        'day_to_shipping',
      ];

      Object.keys(data).forEach((key) => {
        if (requiredFields.includes(key)) {
          setValue(key, data[key]);
        } else if (['avatar_img', 'image_list'].includes(key)) {
          if (data[key] !== null) {
            setImages((images) => ({
              ...images,
              [key]: data[key],
            }));
          }
        } else if (optionalFields.includes(key) && data[key] !== null) {
          setValue(key, data[key]);
        }
      });
    },
    [setValue]
  );

  useEffect(() => {
    getProductByCode(code)
      .then((res) => {
        if (res.status === 200) {
          setFieldsValue(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar(err.message, {variant: 'error'});
        enqueueSnackbar('Không tải được thông tin sản phẩm, mời thử lại!', {variant: 'error'});
      })
      .finally(() => setLoading(false));
    return () => null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, code]);

  // Handle Submit
  const onSubmit = useCallback(
    async (data) => {
      const falsyData = [undefined, null, ''];
      const imageFields = ['image_1', 'image_2', 'image_3', 'image_4'];
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (
          key !== 'avatar_img' &&
          key !== 'image_list' &&
          key !== 'location' &&
          !imageFields.includes(key) &&
          !falsyData.includes(data[key])
        ) {
          if (['price', 'price_sale', 'category_id'].includes(key)) {
            const value = +data[key];
            formData.append(key, value);
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      if (data.location !== 'null') {
        formData.append('location', data.location);
      }

      //append into formdata
      if (data.avatar_img.length > 0) {
        formData.append('avatar_img', data.avatar_img[0]); //require
      }

      // image list check
      Object.keys(data).forEach((key) => {
        if (imageFields.includes(key)) {
          if (data[key]?.length > 0 && !!data[key][0]) {
            formData.append(key, data[key][0]);
          }
        }
      });

      await putProductForUpdate(code, formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Chỉnh sửa sản phẩm thành công!', {
              variant: 'success',
            });
            navigate('/dashboard/products');
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, {variant: 'error'});
          enqueueSnackbar('Chỉnh sửa sản phẩm thất bại! Mời thử lại', {
            variant: 'error',
          });
        });

      return () => {};
    },
    [enqueueSnackbar, code, navigate]
  );

  return (
    <Page title="Cập nhật sản phẩm">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4" component="h2" align="center">
            Chỉnh sửa sản phẩm
          </Typography>
          <Collapse in={!loading}>
            <ProductForm methods={methods} onSubmit={onSubmit} id="update" images={images} />
          </Collapse>
        </Stack>
      </Container>
    </Page>
  );
};

export default UpdateProductDemo;
