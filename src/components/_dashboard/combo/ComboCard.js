import {memo, useLayoutEffect, useCallback, useState} from 'react';
import {
  Stack,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Grid,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@mui/material';
import Label from 'src/components/Label';
import {fVNCurrency} from 'src/utils/formatNumber';
import {Link as RouterLink} from 'react-router-dom';
import {useSnackbar} from 'notistack';

// api
import {setActiveComboById} from 'src/api/combo';

const setCol = {
  2: {
    xs: 12,
    md: 6,
  },
  3: {
    xs: 12,
    md: 4,
  },
  4: {
    xs: 12,
    md: 3,
  },
};

const ComboCard = ({data, image, col, type}) => {
  const [isActive, setIsActive] = useState(data.is_active);
  const {enqueueSnackbar} = useSnackbar();

  // First Render
  useLayoutEffect(() => {
    setIsActive(data?.is_active);
  }, [data, setIsActive]);

  const settings = (type) => {
    if (type === 'review') {
      return {
        xs: 12,
      };
    } else if (type === 'show') {
      return {...setCol[col]};
    } else {
      return {
        xs: 12,
        md: 4,
      };
    }
  };

  // Handle Change Combo Active
  const handleChangeState = useCallback(
    (e) => {
      setIsActive(e.target.checked);
      setActiveComboById(data.id, e.target.checked)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar('Cập nhật trạng thái thành công', {
              variant: 'success',
              preventDuplicate: 0
            });
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Cập nhật trạng thái thất bại', {
            variant: 'error',
          });
          enqueueSnackbar(err.message, {variant: 'error'});
        });
      return () => null;
    },
    [data.id, enqueueSnackbar]
  );

  return (
    <Grid item {...settings(type)}>
      <Card variant="outlined" sx={{p: 2}}>
        <CardMedia
          component="img"
          image={
            image ||
            'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'
          }
          height="200"
          alt={data.title}
        />
        <CardContent>
          {type === 'show' ? (
            <Stack>
              <Typography
                component={RouterLink}
                to={`/dashboard/combo/update/${data.id}`}
                variant="h5"
                color="primary"
              >
                {data?.name || 'Title Combo...'}
              </Typography>
              <Typography
                component={RouterLink}
                to={`/dashboard/combo/update/${data?.id}`}
                color="primary"
              >
                {data?.detail || 'Chi tiết...'}
              </Typography>
            </Stack>
          ) : (
            <Stack>
              <Typography variant="h5">{data?.name || 'Tên Combo...'}</Typography>
              <Typography>{data?.detail || 'Chi tiết...'}</Typography>
            </Stack>
          )}
        </CardContent>
        <CardActions sx={{justifyContent: 'space-between'}}>
          <Stack spacing={2} sx={{width: '250px'}}>
            {data.total_money_sale &&
              data.recommend_price &&
              data.total_money_sale > data.recommend_price && (
                <Typography variant="body1" sx={{textDecoration: 'line-through', fontSize: '15px'}}>
                  {!!data?.total_money_sale
                    ? fVNCurrency.format(data?.total_money_sale)
                    : 'Chưa đặt giá bán...'}
                </Typography>
              )}
            <Typography
              variant="overline"
              sx={{fontWeight: 700, fontSize: '20px', lineHeight: '20px'}}
            >
              {!!data.recommend_price
                ? fVNCurrency.format(data.recommend_price)
                : 'Chưa đặt giá bán đề nghị...'}
            </Typography>
          </Stack>
          {type === 'show' && (
            <Stack sx={{width: '290px'}}>
              <FormGroup sx={{alignItems: 'flex-start', gap: 3}}>
                <FormLabel>Trạng thái: </FormLabel>
                <FormControlLabel
                  control={<Switch checked={isActive} onChange={handleChangeState} />}
                  label={
                    isActive ? (
                      <Label color="success">Đang hoạt động</Label>
                    ) : (
                      <Label color="error">Tạm ngừng bán</Label>
                    )
                  }
                />
              </FormGroup>
            </Stack>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default memo(ComboCard);
