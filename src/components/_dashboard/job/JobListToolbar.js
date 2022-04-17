import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
// import { DevTool } from "@hookform/devtools";
// material
import { experimentalStyled as styled } from '@mui/material/styles';
import {
  Stack,
  Box,
  Toolbar,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

import JobSort from './JobSort';
import JobFilterSidebar from './JobFilterSidebar';
import { useForm, FormProvider } from 'react-hook-form';

import { useState } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

const JobListToolbar = ({ numSelected, filterName, onFilterName }) => {
  const [openFilter, setOpenFilter] = useState(false);
  // const formik = useFormik({
  //   initialValues: {
  //     gender: '',
  //     category: '',
  //     colors: '',
  //     priceRange: '',
  //     rating: '',
  //   },
  //   onSubmit: () => {
  //     setOpenFilter(false);
  //   },
  // });

  // const { resetForm, handleSubmit } = formik;

  const initValue = {
    gender: '',
    category: '',
    colors: '',
    priceRange: '',
    rating: '',
  };

  const methods = useForm({
    defaultValues: initValue,
    mode: 'onChange',
  });

  const { register, handleSubmit, reset } = methods;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit(onSubmit, onError);
    reset(initValue);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const onError = (data) => {
    console.error(data);
  };

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <FormProvider {...methods}>
        <Stack
          direction='row'
          justifyContent='space-between'
          component='form'
          onSubmit={handleSubmit(onSubmit, onError)}
          autoComplete='false'
          sx={{ width: '100%' }}
        >
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder='Tìm kiếm số điện thoại...'
            startAdornment={
              <InputAdornment position='start'>
                <Box
                  component={Icon}
                  icon={searchFill}
                  sx={{ color: 'text.disabled' }}
                />
              </InputAdornment>
            }
          />
          <JobFilterSidebar
            isOpenFilter={openFilter}
            onResetFilter={handleResetFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            register={register}
          />
          <JobSort />
          {/* <DevTool control={control} /> */}
        </Stack>
      </FormProvider>
    </RootStyle>
  );
};

JobListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default JobListToolbar;
