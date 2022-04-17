import {useForm} from 'react-hook-form';
import {ProductForm} from 'src/components/_dashboard/products';
import Page from 'src/components/Page';
import {Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {postNewProduct} from 'src/api/products';
import {yupResolver} from '@hookform/resolvers/yup';
import {AddProductSchema} from 'src/schema/ProductSchema';
import {useCallback} from 'react';

const AddProductDemo = () => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: yupResolver(AddProductSchema),
    defaultValues: {
      unit: 'kg',
      weight: 1,
      price: 10000,
      stock: 100,
      location: 0,
      belong_to_store: 0,
      is_show_on_homepage: true,
      is_show_on_store: true,
      is_show_on_combo: true
    },
  });

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
          if (['price', 'price_sale'].includes(key)) {
            const price = +data[key];
            formData.append(key, price);
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      if (data.location !== 'null') {
        formData.append('location', data.location);
      }

      //append into formdata
      formData.append('avatar_img', data.avatar_img[0]); //require

      Object.keys(data).forEach((key) => {
        if (imageFields.includes(key)) {
          if (data[key][0]) {
            formData.append(key, data[key][0]);
          }
        }
      });

      await postNewProduct(formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Thêm sản phẩm thành công', {
              variant: 'success',
            });
            navigate('/dashboard/products');
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, {variant: 'error'});
          enqueueSnackbar('Thêm sản phẩm thất bại', {
            variant: 'error',
          });
        });
    },
    [enqueueSnackbar, navigate]
  );

  return (
    <Page title="Thêm sản phẩm mới">
      <Container>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Thêm sản phẩm mới
        </Typography>
        <ProductForm methods={methods} onSubmit={onSubmit} id="add" />
      </Container>
    </Page>
  );
};

export default AddProductDemo;
