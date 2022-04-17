import {Container, Stack, Typography, Collapse} from '@mui/material';
import Page from 'src/components/Page';
import {useForm} from 'react-hook-form';
// import {yupResolver} from '@hookform/resolvers/yup';
import {PromotionForm} from 'src/components/_dashboard/promotions';
import {postNewPromotion} from 'src/api/promotions';
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';
import {useCallback} from 'react';
import {formatTimeToLocal} from 'src/utils/formatTime';

const AddPromotion = () => {
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      time_from: new Date(),
      time_to: new Date(),
      is_active: true,
      promotion_type: 'system',
    },
    // resolver: yupResolver({}),
  });

  // HandleSubmit
  const onSubmit = useCallback(
    async (data) => {
      const formData = new FormData();

      formData.append('code', data?.code.toUpperCase());
      formData.append('title', data?.title);
      formData.append('promotion_type', data?.promotion_type);
      formData.append('image', data?.image[0]);
      formData.append('time_from', formatTimeToLocal(data?.time_from));
      formData.append('time_to', formatTimeToLocal(data?.time_to));

      data?.detail && formData.append('detail', data?.detail);
      data?.rule && formData.append('rule', data?.rule);

      await postNewPromotion(formData)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Tạo mã khuyến mãi mới thành công!', {variant: 'success'});
            navigate(-1, {replace: true});
          }
        })
        .catch((err) => {
          enqueueSnackbar('Không thể tạo mã khuyến mãi mới, mời thử lại!', {variant: 'error'});
        });

      return () => {};
    },
    [enqueueSnackbar, navigate]
  );

  return (
    <Page title="Thêm mã khuyến mãi mới">
      <Container>
        {/* Promotion Form */}
        <Stack direction="row" sx={{mb: 3}}>
          <Typography variant="h4">Thêm mã khuyến mại mới</Typography>
        </Stack>
        <Stack>
          <Collapse in={true} timeout={500}>
            <PromotionForm methods={methods} id="add" onSubmit={onSubmit} />
          </Collapse>
        </Stack>
      </Container>
    </Page>
  );
};

export default AddPromotion;
