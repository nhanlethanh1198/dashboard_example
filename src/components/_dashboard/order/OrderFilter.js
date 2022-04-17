import {FormProvider, Controller} from 'react-hook-form';
import {
  Stack,
  Box,
  FormGroup,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import Label from 'src/components/Label';
import {LocalizationProvider, DesktopDatePicker} from '@mui/lab';
import viLocale from 'date-fns/locale/vi';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {ORDER_STATUS} from 'src/constants/orderStatus';

const OrderFilter = ({methods}) => {
  return (
    <FormProvider {...methods}>
      <Box component="form" noValidate sx={{my: 2, mx: 1}}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
          <Stack direction="row" justifyContent="flex-end" spacing={3}>
            <FormGroup sx={{width: '9vw'}}>
              <Controller
                name="fromDate"
                control={methods.control}
                render={({field}) => {
                  return (
                    <DesktopDatePicker
                      {...field}
                      label="Từ ngày"
                      disableFuture
                      mask="__/__/____"
                      openTo="day"
                      views={['day', 'month', 'year']}
                      defaultValue={field.value}
                      value={field.value}
                      inputProps={{
                        'aria-label': 'fromDate',
                      }}
                      onChange={(newValue) => {
                        methods.setValue(field.name, newValue);
                      }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            error={false && params.error}
                            size="small"
                            helperText={null}
                            variant="outlined"
                          />
                        );
                      }}
                    />
                  );
                }}
              />
            </FormGroup>
            <FormGroup sx={{width: '9vw'}}>
              <Controller
                name="toDate"
                control={methods.control}
                render={({field}) => {
                  return (
                    <DesktopDatePicker
                      {...field}
                      disableFuture
                      label="Đến ngày"
                      // minDate={toDateMin}
                      mask="__/__/____"
                      openTo="day"
                      views={['day', 'month', 'year']}
                      defaultValue={field.value}
                      value={field.value}
                      inputProps={{
                        'aria-label': 'toDate',
                      }}
                      onChange={(newValue) => {
                        methods.setValue(field.name, newValue);
                      }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            error={false && params.error}
                            helperText={null}
                            size="small"
                            variant="outlined"
                          />
                        );
                      }}
                    />
                  );
                }}
              />
            </FormGroup>
            <FormControl sx={{width: '9vw'}} variant="outlined" size="small">
              <Controller
                name="status"
                control={methods.control}
                defaultValue=""
                render={({field}) => {
                  return (
                    <>
                      <InputLabel id="status_filter">Trạng thái</InputLabel>
                      <Select
                        onChange={field.onChange}
                        value={field.value}
                        labelId="status_filter"
                        label="Trạng thái"
                        renderValue={(value) => (
                          <Label color={ORDER_STATUS[value].type}>
                            {ORDER_STATUS[value].title}
                          </Label>
                        )}
                      >
                        <MenuItem value="">Tất cả</MenuItem>
                        {Object.keys(ORDER_STATUS).map((i) => (
                          <MenuItem key={i} value={i}>
                            <Label color={ORDER_STATUS[i].type}>{ORDER_STATUS[i].title}</Label>
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  );
                }}
              />
            </FormControl>
          </Stack>
        </LocalizationProvider>
      </Box>
      {/* <DevTool control={methods.control} placement="bottom-right" /> */}
    </FormProvider>
  );
};

export default OrderFilter;
