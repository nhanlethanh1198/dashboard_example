import {Controller} from 'react-hook-form';
import {TextField} from '@mui/material';
// import {useRef} from 'react';
// import useNodeOffsets from 'react-offsets';

const ControllerTextField = ({control, name, label, ...order}) => {
  // const inputLabel = useRef();
  // const labelOffsets = useNodeOffsets(inputLabel);

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}, formState: {error}}) => (
        <TextField
          value={value}
          onChange={onChange}
          label={label}
          // InputProps={{
          //   labelWidth: labelOffsets.offsetWidth,
          // }}
          // InputLabelProps={{
          //   ref: inputLabel,
          // }}
          {...order}
          error={!!error?.message}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default ControllerTextField;
