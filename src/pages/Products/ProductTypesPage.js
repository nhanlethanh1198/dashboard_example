import {useEffect, useState, useCallback, useRef} from 'react';
import {useSnackbar} from 'notistack';
import {Box, Container, Grid, Stack, Typography, Zoom} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import Page from 'src/components/Page';

import {ProductTabPanel, ProductTabHeader} from 'src/components/_dashboard/productType';
import {
  ProductTabPanelBody,
} from 'src/components/_dashboard/productType/TabBody';
import {
  getProductSale,
  getProductByType,
  syncProductSale,
  updateProductSale,
} from 'src/api/products';

// Utils
import {isArrayEqual} from 'src/utils/compareUtils';

// Update Product Score
const handleChangeUpdateProductScore = (productList = []) => {
  const list = productList?.map((item, index) => ({
    code: '' + item.code,
    score: index + 1,
  }));
  return {list_product: list};
};

const types = ['sale', 'trend', 'newest', 'vote'];

const ProductTypesPage = () => {
  const {enqueueSnackbar} = useSnackbar();
  const tempProductList = useRef([]);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);

  // Handle Change Page
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // HandleChangeTab
  const onChangeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Get Data
  const getType = useCallback(
    async (tabIndex) => {
      if (tabIndex === 0) {
        await getProductSale()
          .then((res) => {
            if (res.status === 200) {
              const data = res.data;
              setProductList(data.data);
              // tempProductList for compare productList after drag
              tempProductList.current = data.data;
            }
          })
          .catch((err) => {
            console.error(err);
            enqueueSnackbar(err.message, {variant: 'error'});
            enqueueSnackbar(`Không tải được danh sách "Giá tốt hôm nay!`, {
              variant: 'error',
              preventDuplicate: true,
            });
            setProductList([]);
          })
          .finally(() => setLoading(false));
      } else {
        setProductList([]);
        await getProductByType(types[tabIndex])
          .then((res) => {
            if (res.status === 200) {
              const data = res.data;
              setProductList(data.data);
              // tempProductList for compare productList after drag
              tempProductList.current = data.data;
              console.log(tempProductList.current);
            }
          })
          .catch((err) => {
            console.error(err);
            const errorMessage = [
              {
                type: 'sale',
                message: 'Giá tốt hôm nay',
              },
              {
                type: 'trend',
                message: 'Xu hướng',
              },
              {
                type: 'arrival',
                message: 'Mới nhất',
              },
              {
                type: 'vote',
                message: 'Đánh giá cao',
              },
            ];
            enqueueSnackbar(err.message, {variant: 'error'});
            enqueueSnackbar(`Không tải được danh sách "${errorMessage[tabIndex].message}"`, {
              variant: 'error',
              preventDuplicate: true,
            });
            setProductList([]);
          })
          .finally(() => setLoading(false));
      }
      return () => {};
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enqueueSnackbar, page]
  );

  // Handle Sync Product Sale
  const handleSyncProductSale = useCallback(() => {
    setSyncLoading(true);
    syncProductSale()
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar('Đồng bộ thành công', {variant: 'info'});
        }
      })
      .then(() => {
        getType(tabIndex);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar(err.message, {variant: 'error'});
        enqueueSnackbar('Không đồng bộ được sản phẩm', {variant: 'error'});
      })
      .finally(() => {
        setSyncLoading(false);
      });
  }, [enqueueSnackbar, getType, tabIndex]);

  // Handle Update Product Sale with Score
  const handleUpdateProductSalePosition = useCallback(async () => {
    const req = handleChangeUpdateProductScore(productList);
    await updateProductSale(req, types[tabIndex])
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar('Cập nhật thành công', {variant: 'success', preventDuplicate: false});
        }
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar(err.message, {variant: 'error'});
        enqueueSnackbar('Không cập nhật được vị trí sản phẩm', {
          variant: 'error',
          preventDuplicate: false,
        });
      });
    return () => {};
  }, [enqueueSnackbar, tabIndex, productList]);

  useEffect(() => {
    getType(tabIndex);
    return () => null;
  }, [tabIndex, getType]);

  return (
    <Page title="Sản phẩm theo loại" sx={{}}>
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom>
          Sản phẩm theo loại:
        </Typography>

        <Box>
          <Grid container>
            <Grid item xs={9}>
              <ProductTabHeader tabIndex={tabIndex} onChangeTabIndex={onChangeTabIndex} />
            </Grid>
            <Grid item xs={3}>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{height: '100%'}}
              >
                <Zoom in={tabIndex === 0} unmountOnExit>
                  <LoadingButton
                    loading={syncLoading}
                    variant="contained"
                    onClick={handleSyncProductSale}
                  >
                    Đồng bộ sản phẩm
                  </LoadingButton>
                </Zoom>
              </Stack>
            </Grid>
          </Grid>
          <ProductTabPanel value={tabIndex} index={tabIndex}>
            <ProductTabPanelBody
              loading={loading}
              productList={productList}
              setOrderedProductList={setProductList}
              handleChangePage={handleChangePage}
              isChangedArr={!isArrayEqual(tempProductList.current, productList)}
              handleUpdateProductSalePosition={handleUpdateProductSalePosition}
            />
          </ProductTabPanel>
        </Box>
      </Container>
    </Page>
  );
};

export default ProductTypesPage;
