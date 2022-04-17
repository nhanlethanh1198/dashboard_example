import { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
// import { experimentalStyled as styled } from '@mui/material/styles'

export default function DatePickerField(props) {
  const [value, setValue] = useState(new Date())

  useEffect(() => {
    setValue(props.value || new Date())
  }, [props.value])

  console.log(props)

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        disableFuture
        format='dd/MM/yyy'
        openTo='year'
        views={['year', 'month', 'day']}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          <>
            <TextField ref={inputRef} {...inputProps} />
            {InputProps?.endAdornment}
          </>
        )}
      />
    </LocalizationProvider>
  )
}
