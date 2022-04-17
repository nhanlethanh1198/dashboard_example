import {Controller, FormProvider} from 'react-hook-form';
import {get} from 'lodash';
import {getListCategory} from 'src/api/categories';
import {getStoreList} from 'src/api/stores';
import {useSnackbar} from 'notistack';
// material
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {useEffect, useCallback, useState} from 'react';
import {useStoreActions, useStoreState} from 'easy-peasy';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
// ----------------------------------------------------------------------

const ProductCategoryFilter = ({methods}) => {
  const {reset} = methods;
  const [stores, setStores] = useState([]);
  const {categories} = useStoreState((state) => state.categories);
  const {setListCategory} = useStoreActions((actions) => actions.categories);
  const {enqueueSnackbar} = useSnackbar();

  const getStores = useCallback(async () => {
    await getStoreList().then(res => {
      if (res.status === 200) {
        setStores(res.data.data);
      }
    }).catch(err => {
      console.error(err);
      enqueueSnackbar('Không tải được danh sách cửa hàng, xin mời tải lại!', {variant: 'error'});
    });
    return () => {
    };
  }, [enqueueSnackbar]);


  useEffect(() => {
    if (categories.length === 0) {
      Promise.all([getListCategory(), getStores()])
        .then((res) => {
          setListCategory(get(res[0], 'data.data', []));
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Không tải được danh sách danh mục! Mời thử lại', {variant: 'error'});
        });
    }
    return () => null;
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <FormProvider {...methods}>
        <Box component='form'>
          <Stack direction={'row'} spacing={3} sx={{minWidth: '40vw'}}>
            <Controller
              name='store_id'
              control={methods.control}
              render={({field}) => (
                <FormControl fullWidth size='small'>
                  <InputLabel id={'store_id_label'}>Cửa hàng</InputLabel>
                  <Select
                    labelId={'store_id_label'}
                    id={'store_id'}
                    label={'Cửa hàng'}
                    variant={'outlined'}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    MenuProps={{
                      sx: {maxHeight: '300px'},
                    }}
                    renderValue={(value) => {
                      const store = stores.find(item => item.id === value);
                      return (
                        <Stack direction={'row'} spacing={2}>
                          <Avatar src={store.avatar} sx={{height: 20, width: 20}} />
                          <Typography variant='body1'>{store.name}</Typography>
                        </Stack>
                      );
                    }}

                  >
                    <MenuItem value={''}>Tất cả cửa hàng</MenuItem>
                    {stores.map(store => (
                      <MenuItem key={store.id} value={store.id} sx={{gap: 2}}>
                        <Avatar src={store.avatar} sx={{height: 20, width: 20}} />
                        {store.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={methods.control}
              name='product_category_filter'
              defaultValue={''}
              render={({field}) => (
                <FormControl fullWidth size={'small'}>
                  <InputLabel id={`product_category_filter_label`} sx={{background: '#fff', px: 1}}>
                    Danh mục
                  </InputLabel>
                  <Select
                    labelId={`product_category_filter_label`}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label='Danh mục'
                    MenuProps={{
                      sx: {maxHeight: '300px'},
                    }}
                    renderValue={(selected) =>
                      selected && (
                        <Stack
                          sx={{height: '25px', gap: '10px'}}
                          flexWrap='nowrap'
                          flexDirection='row'
                          alignItems='center'
                        >
                          <Avatar
                            src={selected.image}
                            alt={selected.name}
                            sx={{width: 20, height: 20}}
                            imgProps={{loading: 'eager'}}
                          />
                          <Typography
                            sx={{
                              height: '24px',
                              marginTop: '0 !important',
                              lineHeight: '24px',
                            }}
                          >
                            {selected.name}
                          </Typography>
                        </Stack>
                      )
                    }
                  >
                    {categories.length > 0 &&
                    categories.map((item) => (
                      <MenuItem key={item.id} value={item} sx={{gap: 3}}>
                        <Avatar src={item.image} alt={item.name} imgProps={{loading: 'eager'}} />
                        <Typography variant='subtitle1'>{item.name}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={methods.control}
              name='product_status_filter'
              render={({field}) => (
                <FormControl fullWidth size={'small'}>
                  <InputLabel id={`product_status_filter_label`} sx={{background: '#fff', px: 1}}>
                    Trạng thái
                  </InputLabel>
                  <Select
                    labelId={`product_status_filter_label`}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label='Danh mục'
                  >
                    <MenuItem value={1}>Còn hàng</MenuItem>
                    <MenuItem value={2}>Hết hàng</MenuItem>
                    <MenuItem value={3}>Đang nhập hàng</MenuItem>
                    <MenuItem value={4}>Đã khoá</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </Box>
        <IconButton
          size='medium'
          color='success'
          onClick={() => {
            return reset({
              product_category_filter: {id: null},
              product_status_filter: null,
            });
          }}
        >
          <RotateLeftIcon fontSize='inherit' />
        </IconButton>
      </FormProvider>
    </>
  );
};

export default ProductCategoryFilter;
