import {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useSnackbar} from 'notistack';
import {useNavigate, useParams} from 'react-router-dom';
import {Container, Typography} from '@mui/material';
import Page from 'src/components/Page';
import {CategoryForm} from 'src/components/_dashboard/categories';

// api
import {updateCategoryAPI, getCategoryById} from 'src/api/categories';

const UpdateCategory = () => {
  const {category_id} = useParams();
  const [initImage, setInitImage] = useState('');

  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const {setValue} = methods;

  //   Handle Set Field Value
  const setFieldValue = useCallback(
    (data) => {
      setValue('name', data.name);
      setValue('parent_id', data.parent_id);
      console.log(data);
      setInitImage(data?.image);

      return () => {};
    },
    [setInitImage, setValue]
  );

  //   Handle Fetch Data
  const getData = useCallback(
    async (categories_id) => {
      await getCategoryById(categories_id)
        .then((res) => {
          if (res.status === 200) {
            setFieldValue(res.data.data);
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Không tải được thông tin danh mục! Mời thử lại!');
        });

      return () => {};
    },
    [enqueueSnackbar, setFieldValue]
  );

  // HandleSubmit
  const onSubmit = useCallback(
    async (data) => {
      console.log(data);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('parent_id', data.parent_id);
      if (data.img.length > 0) {
        formData.append('img', data.img[0]);
      }

      await updateCategoryAPI(category_id, formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Category added successfully', {
              variant: 'success',
            });
            navigate('/dashboard/categories', {replace: true});
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Something went wrong', {variant: 'error'});
        });

      return () => {};
    },
    [enqueueSnackbar, navigate, category_id]
  );

  useEffect(() => {
    getData(category_id);
  }, [getData, category_id]);

  return (
    <Page title="Thêm Danh mục sản phẩm">
      <Container>
        <Typography variant="h4" gutterBottom align="center">
          Chỉnh sửa danh mục sản phẩm
        </Typography>
        <CategoryForm onSubmit={onSubmit} methods={methods} id="update" initImage={initImage} />
      </Container>
    </Page>
  );
};

export default UpdateCategory;
