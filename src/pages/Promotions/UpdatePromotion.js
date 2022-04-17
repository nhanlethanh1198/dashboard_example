import {Container, Stack, Typography, Collapse} from '@mui/material';
import Page from 'src/components/Page';
import {useForm} from 'react-hook-form';
// import {yupResolver} from '@hookform/resolvers/yup';
import {PromotionForm} from 'src/components/_dashboard/promotions';
import {useParams} from 'react-router-dom';
import {useLayoutEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {getPromotionById, putUpdatePromotion} from 'src/api/promotions';
import {formatTimeToLocal} from 'src/utils/formatTime';

const UpdatePromotion = () => {
  const {id} = useParams();
  const [imageReview, setImageReivew] = useState('');
  const [loading, setLoading] = useState(true);
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onSubmit',
    // resolver: yupResolver({}),
    defaultValues: {
      promotion_type: 'system',
    },
  });

  const {setValue} = methods;

  // Set field Value at first Render
  const setDefaultValue = (data) => {
    const fields = [
      'code',
      'title',
      'detail',
      'rule',
      'time_from',
      'time_to',
      'is_active',
      'promotion_type',
    ];
    Object.keys(data).forEach((key) => {
      if (fields.includes(key)) {
        if (data[key] !== null) {
          setValue(key, data[key], {shouldTouch: true});
        }
      }
    });
    setImageReivew(data?.image);
  };

  // Handle Submit
  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();
      formData.append('code', data?.code.toUpperCase());
      formData.append('title', data?.title);
      formData.append('promotion_type', data?.promotion_type);

      // Check changed Image
      if (data.image.length > 0 && data.image[0] !== undefined) {
        formData.append('image', data?.image[0]);
      }

      Object.keys(data).forEach((key) => {
        if (['time_from', 'time_to'].includes(key)) {
          const date = new Date(data[key]);
          const time = formatTimeToLocal(date);
          formData.append(key, time);
        }
        // Check Description and title is not blank
        else if (!['code', 'title', 'promotion_type', 'image'].includes(key) && data[key] !== '') {
          formData.append(key, data[key]);
        }
      });

      await putUpdatePromotion(id, formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Chỉnh sửa mã khuyến mãi thành công!', {variant: 'success'});
            navigate(-1, {replace: true});
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar(err.message, {variant: 'error'});
          enqueueSnackbar('Không thể chỉnh sửa mã khuyến mãi, mời thử lại!', {variant: 'error'});
        });
      return () => {};
    },
    [enqueueSnackbar, navigate, id]
  );

  useLayoutEffect(() => {
    getPromotionById(id)
      .then((res) => {
        const data = res.data.data;
        setDefaultValue(data);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Lỗi mạng! Không tải được thông tin mã khuyến mãi, mờI thử lại!', {
          variant: 'error',
        });
      })
      .finally(() => setLoading(false));

    // Clean effect
    return () => null;
    // eslint-disable-next-line
  }, [id, enqueueSnackbar, setLoading]);

  return (
    <Page title="Thêm mã khuyến mãi mới">
      <Container>
        {/* Promotion Form */}
        <Stack direction="row" sx={{mb: 3}}>
          <Typography variant="h4">Chỉnh sửa mã khuyến mãi</Typography>
        </Stack>
        <Stack>
          <Collapse in={!loading} timeout={500}>
            <PromotionForm
              methods={methods}
              id="update"
              onSubmit={onSubmit}
              initImage={imageReview}
            />
          </Collapse>
        </Stack>
      </Container>
    </Page>
  );
};

export default UpdatePromotion;
