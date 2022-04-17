import {Button, Container, Card, Stack, Typography, Alert, CircularProgress} from '@mui/material';
import Page from 'src/components/Page';
import {useParams} from 'react-router-dom';
import {memo, useEffect, useState, useCallback} from 'react';
import {getOrderById} from 'src/api/orders';
import {OrderInfoBody} from 'src/components/_dashboard/order';
import {useSnackbar} from 'notistack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router-dom';

const OrderInfo = memo(() => {
  const {id} = useParams();
  const [orderInfo, setOrderInfo] = useState({});
  const [orderDetail, setOrderDetail] = useState([]);
  const [error, setError] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  const [render, setRender] = useState(false);
  const navigate = useNavigate();

  const getOrderDetail = useCallback(async (id) => {
    await getOrderById(id)
      .then((res) => {
        const {order, order_detail} = res?.data;
        setOrderInfo(order);
        setOrderDetail(order_detail);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        enqueueSnackbar('Tải thông tin đơn hàng thất bại! Mời thử lại!', {variant: 'error'});
      });

      return () => {}
  }, [enqueueSnackbar]);

  useEffect(() => {
    getOrderDetail(id);
    return () => null;
    // eslint-disable-next-line
  }, [render]);

  return (
    <Page title="Thông tin đơn hàng">
      <Container>
        <Stack direction="row">
          <Typography variant="h4">Thông tin đơn hàng</Typography>
        </Stack>
        <Button
          sx={{my: 3}}
          size="small"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1, {replace: true})}
        >
          Trở về
        </Button>
        <Card sx={{p: 5}}>
          {error === true ? (
            <Stack sx={{width: '100%'}}>
              <Alert severity="error" sx={{flexBasic: 1}}>
                Tải thông tin đơn hàng thất bại! Mời bạn thử lại!
              </Alert>
            </Stack>
          ) : orderInfo === {} ? (
            <Stack justifyContent="center">
              <CircularProgress />
            </Stack>
          ) : (
            <OrderInfoBody orderInfo={orderInfo} orderDetail={orderDetail} setRender={setRender} />
          )}
        </Card>
      </Container>
    </Page>
  );
});

export default OrderInfo;
