import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import searchFill from '@iconify/icons-eva/search-fill';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
//
import Scrollbar from '../../Scrollbar';
// import ColorManyPicker from '../../ColorManyPicker';

// ----------------------------------------------------------------------
import {
  FILTER_TYPE_OPTIONS,
  FILTER_STATUS_OPTIONS,
  FILTER_PRICE_OPTIONS,
} from './constants';
// ----------------------------------------------------------------------

const JobFilterSidebar = ({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
  register,
}) => {
  return (
    <>
      <Button
        disableRipple
        color='inherit'
        endIcon={<Icon icon={roundFilterList} />}
        onClick={onOpenFilter}
      >
        Lọc &nbsp;
      </Button>
      <Box autoComplete='off' noValidate>
        <Drawer
          anchor='right'
          open={isOpenFilter}
          onClose={onCloseFilter}
          PaperProps={{
            sx: { width: 280, border: 'none', overflow: 'hidden' },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            sx={{ px: 1, py: 2 }}
          >
            <Typography variant='subtitle1' sx={{ ml: 1 }}>
              Lọc
            </Typography>
            <IconButton onClick={onCloseFilter}>
              <Icon icon={closeFill} width={20} height={20} />
            </IconButton>
          </Stack>

          <Divider />

          <Scrollbar>
            <Stack spacing={3} sx={{ p: 3 }}>
              <div>
                <Typography variant='subtitle1' gutterBottom>
                  Loại công việc
                </Typography>
                <FormGroup>
                  {FILTER_TYPE_OPTIONS.map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          {...register('gender')}
                          value={item}
                          // checked={values.gender.includes(item)}
                        />
                      }
                      label={item}
                    />
                  ))}
                </FormGroup>
              </div>

              <div>
                <Typography variant='subtitle1' gutterBottom>
                  Trạng thái
                </Typography>
                <RadioGroup {...register('category')}>
                  {FILTER_STATUS_OPTIONS.map((item) => (
                    <FormControlLabel
                      key={item}
                      value={item}
                      control={<Radio />}
                      label={item}
                    />
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Typography variant='subtitle1' gutterBottom>
                  Thời gian tạo
                </Typography>
                <RadioGroup {...register('priceRange')}>
                  {FILTER_PRICE_OPTIONS.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={<Radio />}
                      label={item.label}
                    />
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Typography variant='subtitle1' gutterBottom>
                  Thời gian làm việc
                </Typography>
                <RadioGroup {...register('priceRange')}>
                  {FILTER_PRICE_OPTIONS.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={<Radio />}
                      label={item.label}
                    />
                  ))}
                </RadioGroup>
              </div>
            </Stack>
          </Scrollbar>

          <Box sx={{ p: 3 }}>
            <Button
              fullWidth
              size='large'
              type='submit'
              color='inherit'
              variant='outlined'
              onClick={onResetFilter}
              startIcon={<Icon icon={searchFill} />}
            >
              Tìm
            </Button>
          </Box>
        </Drawer>
      </Box>
    </>
  );
};

JobFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  formik: PropTypes.object,
};

export default JobFilterSidebar;
