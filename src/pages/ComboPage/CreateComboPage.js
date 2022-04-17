import {useCallback, useState} from 'react';
import Page from 'src/components/Page';
import {Container, Stack, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {ComboForm} from 'src/components/_dashboard/combo';
import {createNewCombo} from 'src/api/combo';
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';

const CreateComboPage = () => {
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      total_money: 0,
      total_money_sale: 0,
      recommend_price: 0,
      is_active: true,
      products: [],
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'image') {
          formData.append('image', data.image[0]);
        } else if (key === 'products') {
          formData.append('products', JSON.stringify(data.products));
        } else {
          formData.append(key, data[key]);
        }
      });
      console.log(data)

      await createNewCombo(formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Tạo combo mới thành công!', {variant: 'success'});
            navigate(-1, {replace: true});
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, {variant: 'error'});
          enqueueSnackbar('Không tạo được sản phẩm, mời thử lại!', {variant: 'error'});
        });
    },
    [enqueueSnackbar, navigate]
  );

  return (
    <Page title="Tạo Combo mới">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h3" component="h2" align="center">
            Tạo combo mới
          </Typography>
          <ComboForm
            methods={methods}
            onSubmit={onSubmit}
            productList={productList}
            setProductList={setProductList}
          />
        </Stack>
      </Container>
    </Page>
  );
};

export default CreateComboPage;
