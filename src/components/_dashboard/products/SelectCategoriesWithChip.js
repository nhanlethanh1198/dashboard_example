import {useEffect, useState, useCallback} from 'react';
import {Select, MenuItem, Avatar, Stack, Typography, FormControl, InputLabel, FormHelperText} from '@mui/material';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {getListCategory} from 'src/api/categories';
import {useSnackbar} from 'notistack';

const SelectCategoriesWithChip = ({onChange, value, error, ...other}) => {
  // const [categories, setCategories] = useState([]);
  const {categories} = useStoreState((state) => state.categories);
  const {setListCategory} = useStoreActions((actions) => actions.categories);
  const [loading, setLoading] = useState(true);
  const {enqueueSnackbar} = useSnackbar();

  const checkCategoriesStore = useCallback(() => {
    if (categories.length === 0) {
      getListCategory()
        .then((res) => {
          setListCategory(res.data.data);
        })
        .catch((err) => {
          console.error(err);
          enqueueSnackbar('Lỗi khi lấy danh sách danh mục', {variant: 'error'});
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setListCategory, enqueueSnackbar]);

  useEffect(() => {
    checkCategoriesStore();
    return () => null;
  }, [checkCategoriesStore]);

  return (
    <FormControl fullWidth size="medium">
      <InputLabel id="category-select-chip">{other?.label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        labelId="category-select-chip"
        label={other?.label}
        renderValue={(selected) => {
          const category = categories.find((c) => c.id === selected);

          if (category) {
            return (
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar src={category?.image} sx={{width: '20px', height: '20px'}} />
                <Typography>
                  {category?.name} {`(${selected})`}
                </Typography>
              </Stack>
            );
          } else return <Typography>Không chọn</Typography>;
        }}
      >
        <MenuItem value={0}>Không chọn</MenuItem>
        {loading ? (
          <MenuItem value={null}>Đang tải...</MenuItem>
        ) : (
          categories.length &&
          categories?.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              <Avatar
                imgProps={{loading: 'eager'}}
                src={category.image}
                alt={category.name}
                sx={{width: 25, height: 25, mr: 2}}
              />
              {category.name} {` (${category.id})`}
            </MenuItem>
          ))
        )}
      </Select>
      <FormHelperText error={!!error}>{error}</FormHelperText>
    </FormControl>
  );
};

export default SelectCategoriesWithChip;
