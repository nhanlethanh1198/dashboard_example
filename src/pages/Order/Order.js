import {
  Card,
  Container,
  Stack,
  Typography,
  CardActions,
  Collapse,
  TablePagination,
} from '@mui/material';
import {useForm, useWatch} from 'react-hook-form';
import {useEffect, useState} from 'react';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {useSnackbar} from 'notistack';
// Api
import {getListOrder} from 'src/api/orders';

// Component
import Page from 'src/components/Page';
import {OrderFilter, OrderTable} from 'src/components/_dashboard/order';
import Scrollbar from 'src/components/Scrollbar';

import {filter} from 'lodash';

function filterDateRange(array, key, query1, query2) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  if (query1 !== '' && query2 !== '') {
    const date1 = new Date(query1);
    const date2 = new Date(query2);
    return filter(array, (_order) => {
      let date = new Date(_order[key]);
      return date1.getTime() < date.getTime() && date.getTime() < date2.getTime();
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

const _filterStatus = (array, status) => {
  if (status !== '') {
    return array.filter((order) => order.status === +status);
  } else return array;
};

const Order = () => {
  const {setOrderList} = useStoreActions((actions) => actions.orders);
  const {orderList} = useStoreState((state) => state.orders);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    Promise.all([
      getListOrder({
        limit: rowsPerPage,
        skip: page === 0 ? 0 : Number(page * rowsPerPage),
      }),
    ])
      .then((res) => {
        const data = res[0].data.data;
        setOrderList(data);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Tải thông tin đơn hàng thất bại! Mời thử lại!', {variant: 'error'});
      });
    return () => {};
    //eslint-disable-next-line
  }, [rowsPerPage, page]);

  const methods = useForm({
    defaultValues: {
      fromDate: '',
      toDate: '',
      status: '',
    },
    mode: 'onChange',
  });

  const {control, watch} = methods;

  const filterByStatus = watch('status');

  const filterValue = useWatch({
    control,
    name: ['fromDate', 'toDate'],
  });

  const filterOrder = filterDateRange(orderList, 'created_at', filterValue[0], filterValue[1]);

  const filterResult = _filterStatus(filterOrder, filterByStatus);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Page title="Order">
      <Container maxWidth={'xl'}>
        <Stack>
          <Typography variant="h4">Đơn hàng</Typography>
        </Stack>
        <Card sx={{marginTop: 4}}>
          <OrderFilter methods={methods} />
          <Scrollbar sx={{maxHeight: '65vh'}}>
            <Collapse in={filterResult?.length > 0} timeout="auto" exit>
              <OrderTable
                data={filterResult}
                //   pageSize={pageSize}
                //   setPageSize={setPageSize}
                //   page={page}
                //   setPage={setPage}
              />
            </Collapse>
          </Scrollbar>
          <CardActions sx={{justifyContent: 'flex-end'}}>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={filterResult?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardActions>
        </Card>
      </Container>
    </Page>
  );
};

export default Order;
