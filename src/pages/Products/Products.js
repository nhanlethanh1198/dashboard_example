import {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import {useForm} from 'react-hook-form';
// material
import {Container, Stack, Typography, Button, Pagination} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {Icon} from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import {useSnackbar} from 'notistack';

// components
import Page from 'src/components/Page';
import {
  // ProductSort,
  ProductList,
  ProductCategoryFilter,
} from 'src/components/_dashboard/products';

// api
import {getProductsWithParams} from 'src/api/products';

//Store
import ProductStore from 'src/localmodal/ProductStore';

// ----------------------------------------------------------------------

const EcommerceShop = () => {
  const {enqueueSnackbar} = useSnackbar();
  const limit = useRef(16);
  const [pagination, setPagination] = useState({
    prev_page: null,
    next_page: null,
    total_page: 1,
  });
  const [page, setPage] = useState(1);
  const {products} = ProductStore.useStoreState((state) => state);
  const {setProducts} = ProductStore.useStoreActions((action) => action);

  const methods = useForm({
    defaultValues: {
      product_category_filter: '',
      product_status_filter: '',
      store_id: '',
    },
    mode: 'onChange',
  });

  const {watch} = methods;
  const category_id = watch('product_category_filter');
  const status = watch('product_status_filter');
  const store_id = watch('store_id');

  const params = useMemo(
    () => ({
      category_id: category_id?.id || null,
      store_id: store_id || null,
      page: page,
      status: status || null,
      limit: limit.current,
    }),
    [category_id, page, status, limit, store_id],
  );

  const getProductList = useCallback(async (params) => {
    await getProductsWithParams(params).then((res) => {
      setProducts(res.data.data);
      setPagination({
        prev_page: res.data.prev_page,
        next_page: res.data.next_page,
        total_page: res.data.total_page,
      });
    }).catch(err => {
      console.error(err);
      enqueueSnackbar('Kh??ng th??? t???i danh s??ch s???n ph???m, m???i th??? l???i', {variant: 'error'});
    });
    return () => {
    };
  }, [setProducts, enqueueSnackbar]);


  useEffect(() => {
    getProductList(params);
    return () => {
    };
  }, [params, getProductList]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Page title='Danh s??ch s???n ph???m' pb={0}>
      <Container>
        <Typography variant='h4' sx={{mb: 5}}>
          Danh s??ch s???n ph???m
        </Typography>

        <Stack
          direction='row'
          flexWrap='wrap-reverse'
          alignItems='center'
          justifyContent='space-between'
          flexDirection='row-reverse'
          sx={{mb: 5}}
        >
          <Button
            variant='contained'
            component={RouterLink}
            to='add_product'
            startIcon={<Icon icon={plusFill} />}
          >
            T???o S???n ph???m m???i
          </Button>
          <Stack direction='row' spacing={1} flexShrink={0} sx={{my: 1}}>
            <ProductCategoryFilter methods={methods} />
          </Stack>
        </Stack>
        {products?.length > 0 && <ProductList products={products} />}
        {/* Pagination */}
        {!!products?.length && (
          <Stack justifyContent='center' my={3}>
            {products.length > 0 && (<Pagination
              color='primary'
              size='large'
              count={pagination.total_page}
              defaultPage={1}
              page={page}
              onChange={handleChangePage}
              hidePrevButton={!!pagination.next_page}
              hideNextButton={!!pagination.prev_page}
              sx={{display: 'flex', justifyContent: 'center', gap: 3}}
            />)}
          </Stack>
        )}
      </Container>
    </Page>
  );
};

export default EcommerceShop;
