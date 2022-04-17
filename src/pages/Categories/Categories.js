import {useLayoutEffect, useState, useCallback} from 'react';
import {useStoreActions, useStoreState} from 'easy-peasy';
import {useSnackbar} from 'notistack';
import {Link as RouterLink} from 'react-router-dom';
import {Icon} from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import {Button, Card, Container, Stack, Typography} from '@mui/material';

import {CategoriesTableBody, CategoriesTableToolbar} from 'src/components/_dashboard/categories';
import Page from 'src/components/Page';
import Scrollbar from 'src/components/Scrollbar';
import Loading from 'src/components/Loading';
import {getListCategory} from 'src/api/categories';

import {filter} from 'lodash';

function applySortFilter(array, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  if (query) {
    return filter(
      array,
      (_category) => _category.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const Categories = () => {
  const [filterName, setFilterName] = useState('');
  const {setListCategory} = useStoreActions((actions) => actions.categories);
  const {categories} = useStoreState((states) => states.categories);
  const {render} = useStoreState((states) => states.render);
  const {enqueueSnackbar} = useSnackbar();

  const getCategories = useCallback(async () => {
    await getListCategory()
      .then((res) => {
        if (res.status === 200) {
          const {data} = res.data;
          setListCategory(data);
        }
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Không thể tải danh sách danh mục. Mời bạn thử lại!', {variant: 'error'});
        enqueueSnackbar(err.message, {variant: 'error'});
      });

    return () => {};
  }, [setListCategory, enqueueSnackbar]);

  useLayoutEffect(() => {
    getCategories();
    return () => {};
    // eslint-disable-next-line
  }, [getCategories, render]);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredCategory = applySortFilter(categories, filterName);

  return (
    <Page title="Danh mục sản phẩm">
      <Container maxWidth={'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom sx={{mb: 3}}>
            Danh mục sản phẩm
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="add_category"
            startIcon={<Icon icon={plusFill} />}
          >
            Thêm danh mục
          </Button>
        </Stack>

        <Card>
          <CategoriesTableToolbar filterName={filterName} onFilterName={handleFilterByName} />
          {!categories ? (
            <>
              <Loading />
              <Loading />
            </>
          ) : (
            <Scrollbar sx={{maxHeight: '59vh'}}>
              <CategoriesTableBody categories={filteredCategory} />
            </Scrollbar>
          )}
        </Card>
      </Container>
    </Page>
  );
};

export default Categories;
