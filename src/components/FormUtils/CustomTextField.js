import {Input, InputLabel, FormControl, FormHelperText} from '@mui/material';

const CustomTextField = ({config}) => {
  return (
    <FormControl>
      <InputLabel htmlFor={`${config.name}_label`}>{config.label}</InputLabel>
      <Input {...config.register} id={`${config.name}_label`} />
      <FormHelperText error={!!config?.error}>{config?.error}</FormHelperText>
    </FormControl>
  );
};

export default CustomTextField;
