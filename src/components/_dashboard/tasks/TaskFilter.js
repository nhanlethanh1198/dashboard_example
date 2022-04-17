import {useCallback, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {
  Stack,
  TextField,
  Button,
  IconButton,
  Drawer,
  Typography,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel, Box,
} from '@mui/material';
import closeFill from '@iconify/icons-eva/close-fill';
import {Icon} from '@iconify/react';
import FilterListIcon from '@mui/icons-material/FilterList';
import Scrollbar from 'src/components/Scrollbar';

const TaskFilter = () => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  console.log(showFilterMenu);

  const methods = useForm(
    {
      mode: 'onBlur',
      reValidateMode: 'onChange',
    },
  );

  const {register} = methods;

  const handleChange = useCallback(() => {
  }, []);

  return (
    <FormProvider {...methods}>
      <form onChange={handleChange}>
        <Stack direction={'row'} justifyContent={'space-between'} sx={{p: 2}}>
          <TextField {...register('phone')} label={'Tìm kiếm bằng số điện thoại'} size={'small'} />
          <Button variant={'text'} endIcon={<FilterListIcon />}
                  onClick={() => setShowFilterMenu(true)}>Lọc</Button>
          <Drawer
            anchor={'right'}
            open={showFilterMenu}
            onClose={() => setShowFilterMenu(false)}
            PaperProps={{
              sx: {
                minWidth: '300px',
                border: 'none',
                overflow: 'hidden',
              },
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{px: 1, py: 2}}>
              <Typography variant='subtitle1' sx={{ml: 1}}>
                Lọc
              </Typography>
              <IconButton onClick={() => setShowFilterMenu(false)}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>

            </Stack>
            <Divider />
            <Scrollbar>
              <Stack spacing={3} direction={'column'} sx={{p: 3}}>
                <Box>
                  <Typography variant={'subtitle1'} gutterBottom>Loại công việc</Typography>
                  <RadioGroup {...register('task_type')}>
                    <FormControlLabel
                      value={'all'}
                      control={<Radio />}
                      label={'Tất cả'}
                    />
                    <FormControlLabel
                      value={'odd_shift'}
                      control={<Radio />}
                      label={'Ca lẻ'}
                    />
                    <FormControlLabel
                      value={'fixed_shift'}
                      control={<Radio />}
                      label={'Ca cố định'}
                    />
                  </RadioGroup>
                </Box>
                <Divider />
                <Box>
                  <Typography variant={'subtitle1'} gutterBottom>Trạng thái</Typography>
                  <RadioGroup {...register('status')}>
                    <FormControlLabel
                      value={''}
                      control={<Radio />}
                      label={'Tất cả'}
                    />
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label={'Đang xử lý'}
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label={'Đã có nhân viên'}
                    />
                    <FormControlLabel
                      value={3}
                      control={<Radio />}
                      label={'Nhân viên đang làm việc'}
                    />
                    <FormControlLabel
                      value={4}
                      control={<Radio />}
                      label={'Đã hoàn thành'}
                    />
                    <FormControlLabel
                      value={5}
                      control={<Radio />}
                      label={'Đã hủy'}
                    />
                  </RadioGroup>
                </Box>
                <Divider />
                <Box>
                  <Typography variant={'subtitle1'} gutterBottom>Thời gian tạo</Typography>
                  <Typography variant={'body2'}>Từ:</Typography>
                  {/*<DatePicker {...register('created_at_from')} />*/}
                  Đang phát triển...
                  <Typography variant={'body2'}>Đến:</Typography>
                  {/*<DatePicker {...register('created_at_to')} />*/}
                  Đang phát triển...
                </Box>

              </Stack>
            </Scrollbar>
          </Drawer>
        </Stack>
      </form>
    </FormProvider>
  );

};

export default TaskFilter;