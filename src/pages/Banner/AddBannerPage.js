import {useCallback, useLayoutEffect, useState} from 'react';
import Page from 'src/components/Page';
import {useForm} from 'react-hook-form';
import {Container, Stack, Typography} from '@mui/material';
import {BannerForm} from 'src/components/_dashboard/banner';
import {postCreateBanner} from 'src/api/banner';
import {useSnackbar} from 'notistack';
import {getListCategory} from 'src/api/categories';
import {useNavigate} from 'react-router-dom';

const AddBannerPage = () => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [categories, setCategories] = useState([]);

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useLayoutEffect(() => {
    Promise.all([getListCategory()])
      .then((res) => {
        if (res[0].status === 200) {
          setCategories(res[0].data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Không tải được danh sách danh mục, mời bạn thử lại!', {variant: 'error'});
      });
    return () => null;
  }, [setCategories, enqueueSnackbar]);

  const onSubmit = useCallback(
    (data) => {
      const formData = new FormData();
      formData.append('image', data.image[0]);
      formData.append('title', data.title);
      formData.append('category_id', data.category_id);

      postCreateBanner(formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Tạo banner mới thành công!', {variant: 'success'});
            navigate(-1);
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Không tạo được Banner mới. Xin thử lại!', {variant: 'error'});
        });
    },
    [enqueueSnackbar, navigate]
  );

  return (
    <Page title="Tạo banner mới">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4">Tạo Banner mới</Typography>
          <BannerForm methods={methods} onSubmit={onSubmit} categories={categories} id="add" />
        </Stack>
      </Container>
    </Page>
  );
};

export default AddBannerPage;
