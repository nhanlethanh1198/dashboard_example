import {useForm} from 'react-hook-form';
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';

import Page from 'src/components/Page';

import {Container, Typography} from '@mui/material';

import {CategoryForm} from 'src/components/_dashboard/categories';
import {useCallback} from 'react';

// api
import {addCategoryAPI} from 'src/api/categories';

const AddCategory = () => {
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = useCallback(
    async (data) => {
      console.log(data);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('parent_id', data.parent_id);
      formData.append('img', data.img[0]);
      await addCategoryAPI(formData)
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
    [enqueueSnackbar, navigate]
  );

  return (
    <Page title="Thêm Danh mục sản phẩm">
      <Container>
        <Typography variant="h4" gutterBottom align="center">
          Thêm danh mục sản phẩm mới
        </Typography>
        <CategoryForm onSubmit={onSubmit} methods={methods} id="add" />
      </Container>
    </Page>
  );
};

export default AddCategory;
