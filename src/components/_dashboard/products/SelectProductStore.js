import {useEffect, useState, useCallback} from 'react';
import {Select, MenuItem, Typography, FormControl, InputLabel, FormHelperText} from '@mui/material';
import {useStoreState, useStoreActions} from 'easy-peasy';
import {getStoreListActive} from 'src/api/stores';
import {useSnackbar} from 'notistack';

const SelectProductStore = ({onChange, value, error, ...other}) => {
  // const [categories, setCategories] = useState([]);
  const {storeListActive} = useStoreState((state) => state.stores);
  const {setStoreListActive} = useStoreActions((actions) => actions.stores);
  const [loading, setLoading] = useState(true);
  const {enqueueSnackbar} = useSnackbar();

  const checkStoreListActive = useCallback(() => {
    if (storeListActive.length === 0) {
      getStoreListActive()
        .then((res) => {
          setStoreListActive(res.data.data);
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
  }, [setStoreListActive, enqueueSnackbar]);

  useEffect(() => {
    checkStoreListActive();
    return () => null;
  }, [checkStoreListActive]);

  return (
    <FormControl fullWidth size="medium">
      <InputLabel id="product-store-select">{other?.label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        labelId="product-store-select"
        label={other?.label}
        renderValue={(selected) => {
          const store = storeListActive.find((c) => c.id === selected);
          return <Typography>{store ? store.name : 'Chưa chọn'}</Typography>;
        }}
      >
        <MenuItem value={0} disabled>
          Chọn nhà cung cấp
        </MenuItem>
        {loading ? (
          <MenuItem value={null}>Đang tải...</MenuItem>
        ) : (
          storeListActive.length &&
          storeListActive?.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))
        )}
      </Select>
      <FormHelperText error={!!error}>{error}</FormHelperText>
    </FormControl>
  );
};

export default SelectProductStore;
