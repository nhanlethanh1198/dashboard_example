import {Controller} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import viLocale from 'date-fns/locale/vi';

const CustomDateTimePicker = ({control, name, label, defaultValue}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field}) => (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
          <DateTimePicker
            // mask="__/__/____ __:__ __"
            label={!!label ? label : 'DateTimePicker'}
            renderInput={(params) => <TextField {...params} />}
            value={field.value}
            onChange={field.onChange}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default CustomDateTimePicker;
