import {Button, Card, Collapse, Container, Stack, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Page from 'src/components/Page';
import {getStoreList} from 'src/api/stores';
import {useEffect, useState, useCallback} from 'react';
import {useSnackbar} from 'notistack';
import {useNavigate} from 'react-router-dom';
import {useStoreState} from 'easy-peasy';
import {StoreTable} from 'src/components/_dashboard/stores';

const StoresPage = () => {
  const {enqueueSnackbar} = useSnackbar();
  const {render} = useStoreState((state) => state.render);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [providerList, setProviderList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const getData = useCallback(
    async (page, pageSize) => {
      await getStoreList({page: page+1, limit: pageSize})
        .then((res) => {
          if (res.status === 200) {
            setProviderList(res.data.data);
          }
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Tải danh sách bị lỗi, mời thử lại!', {variant: 'error'});
          enqueueSnackbar(err.message, {variant: 'error'});
        })
        .finally(() => setLoading(false));
      return () => {};
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    getData(page, pageSize);
  }, [getData, render, page, pageSize]);

  return (
    <Page title="Danh sách các nhà cung cấp sản phẩm">
      <Container maxWidth={'xl'}>
        <Stack spacing={3}>
          <Stack justifyContent="space-between" direction="row">
            <Typography variant="h4">Danh sách các nhà cung cấp sản phẩm</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('add_store')}
              size="small"
            >
              Thêm nhà cung cấp mới
            </Button>
          </Stack>
          <Collapse in={!loading}>
            <Card>
              <StoreTable
                providerList={providerList}
                page={page}
                setPage={setPage}
                size={pageSize}
                setPageSize={setPageSize}
              />
            </Card>
          </Collapse>
        </Stack>
      </Container>
    </Page>
  );
};

export default StoresPage;
