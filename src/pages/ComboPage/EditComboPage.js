import Page from 'src/components/Page';
import {Container, Typography, Collapse} from '@mui/material';
import {useForm} from 'react-hook-form';
import {ComboForm} from 'src/components/_dashboard/combo';
import {useParams, useNavigate} from 'react-router-dom';
import {useEffect, useState, useCallback} from 'react';
import {getComboById, updateComboById} from 'src/api/combo';
import {useSnackbar} from 'notistack';

const EditComboPage = () => {
  const {id} = useParams();
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [initImage, setInitImage] = useState(null);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {setValue} = methods;

  // set ProductTable
  const setProductTable = (products) => products?.map((product, index) => ({id: index, ...product}));

  // setFormData
  const setFormData = useCallback(
    (data) => {
      const {created_at, updated_at, id, is_active, image, recommend_price, ...tempData} =
        data.info;
      setValue('is_active', is_active);
      setValue('recommend_price', +recommend_price);
      setInitImage(image);

      // set Value
      Object.keys(tempData).forEach((key) => {
        setValue(key, tempData[key]);
      });

      // setProductTable
      setProductList(setProductTable(data.products));

      return () => null;
    },
    [setValue]
  );

  // getComboById
  const handleGetComboById = useCallback(
    async (id) => {
      await getComboById(id)
        .then((res) => {
          if (res.status === 200) {
            const data = res.data.data;
            setFormData(data);
          }
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar('Lỗi mạng, không thể tải thông tin của combo! Xin thử lại!', {
            variant: 'error',
          });
          enqueueSnackbar(err.message, {variant: 'error'});
        })
        .finally(() => setLoading(false));
    },
    [enqueueSnackbar, setFormData]
  );

  // Fetch Combo Data
  useEffect(() => {
    handleGetComboById(id);
    // clean effect
    return () => null;
  }, [handleGetComboById, id]);

  // HandleSubmit
  const onSubmit = useCallback(
    (data) => {
      const formData = new FormData();

      // Handle FormData
      Object.keys(data).forEach((key) => {
        if (key === 'image') {
          const imageFile = data.image[0];
          if (imageFile !== undefined) {
            formData.append('image', data.image[0]);
          }
        } else if (key === 'recommend_price'){
          formData.append('recommend_price', +data.recommend_price);
        }
        else if (key === 'products') {
          formData.append('products', JSON.stringify(data.products));
        } else {
          formData.append(key, data[key]);
        }
      });

      // Call api here
      updateComboById(id, formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Cập nhật thành công!', {variant: 'success'});
            navigate(-1, {replace: true});
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Chỉnh sửa thất bại!', {variant: 'error'});
          enqueueSnackbar(err.message, {variant: 'error'});
        });
    },
    [enqueueSnackbar, navigate, id]
  );

  return (
    <Page title="Chỉnh sửa combo">
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Chỉnh sửa combo
        </Typography>
        <Collapse in={!loading}>
          <ComboForm
            methods={methods}
            onSubmit={onSubmit}
            initImage={initImage}
            productList={productList}
            setProductList={setProductList}
            id="update"
          />
        </Collapse>
      </Container>
    </Page>
  );
};

export default EditComboPage;
