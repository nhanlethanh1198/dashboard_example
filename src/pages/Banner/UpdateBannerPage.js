import {useCallback, useLayoutEffect, useState} from 'react';
import Page from 'src/components/Page';
import {useForm} from 'react-hook-form';
import {Container, Stack, Typography} from '@mui/material';
import {BannerForm} from 'src/components/_dashboard/banner';
import {putBannerById} from 'src/api/banner';
import {useSnackbar} from 'notistack';
import {getListCategory} from 'src/api/categories';
import {getBannerById} from 'src/api/banner';
import {useNavigate, useParams} from 'react-router-dom';

const UpdateBannerPage = () => {
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [categories, setCategories] = useState([]);
  const {id} = useParams();
  const [initImage, setInitImage] = useState();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {setValue} = methods;

  const setValueData = useCallback(
    (data) => {
      setValue('title', data.title);
      setValue('is_active', data.is_active);
      setInitImage(data.image);
      setValue('category_id', data.category_id);
    },
    [setValue]
  );

  useLayoutEffect(() => {
    Promise.all([getListCategory(), getBannerById(id)])
      .then((res) => {
        if (res[0].status === 200) {
          setCategories(res[0].data.data);
        }
        if (res[1].status === 200) {
          const data = res[1].data.data;
          setValueData(data);
        }
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Không tải được danh sách danh mục, mời bạn thử lại!', {variant: 'error'});
      });
    return () => null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCategories, enqueueSnackbar, id]);

  const onSubmit = useCallback(
    (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== '' || data[key] === undefined || data[key] === null) {
          if (key === 'image') {
            if (!!data.image.length) {
              formData.append(key, data.image[0]);
            }
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      putBannerById(id, formData)
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
    [enqueueSnackbar, navigate, id]
  );

  return (
    <Page title="Chỉnh sửa banner">
      <Container>
        <Stack spacing={3}>
          <Typography variant="h4">Chỉnh sửa Banner</Typography>
          <BannerForm
            methods={methods}
            onSubmit={onSubmit}
            categories={categories}
            initImage={initImage}
            id="update"
            banner_id={id}
          />
        </Stack>
      </Container>
    </Page>
  );
};

export default UpdateBannerPage;
