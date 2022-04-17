import {useLayoutEffect, useCallback} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
  Grow,
  InputAdornment,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {LoadingButton} from '@mui/lab';
import {useForm, FormProvider} from 'react-hook-form';
import {useSnackbar} from 'notistack';

// Icon
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {Icon} from '@iconify/react';
import androidFilled from '@iconify/icons-ant-design/android-filled';
import appleIos from '@iconify/icons-mdi/apple-ios';

// Schema
import VersionSchema from 'src/schema/VersionSchema';
import {yupResolver} from '@hookform/resolvers/yup';

const EditVersionDialog = ({open, handleCloseDialog, versionInfo, onSubmit}) => {
  const theme = useTheme();
  const isMDDevice = useMediaQuery(theme.breakpoints.up('md'));
  const {enqueueSnackbar} = useSnackbar();
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(VersionSchema),
    defaultValues: {
      android: versionInfo.android,
      ios: versionInfo.ios,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = methods;

  // Set field value
  const setValueData = useCallback(
    (versionInfo) => {
      setValue('ios', versionInfo.ios);
      setValue('android', versionInfo.android);
    },
    [setValue]
  );

  useLayoutEffect(() => {
    setValueData(versionInfo);
    return () => null;
  }, [versionInfo, setValueData]);

  const onError = (data) => {
    Object.keys(data).forEach((key) => {
      if (data[key].message) {
        enqueueSnackbar(data[key].message, {variant: 'error'});
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Grow}
    >
      <DialogTitle>Chỉnh sủa thông tin phiên bản</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} id="dialog_form_update_version">
            <Stack spacing={3} sx={{mt: 1}}>
              <TextField
                label="Android version"
                {...register('android')}
                error={!!errors?.android?.message}
                helperText={errors?.android?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon={androidFilled} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="iOS version"
                {...register('ios')}
                error={!!errors?.ios?.message}
                helperText={errors?.ios?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon={appleIos} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions sx={{justifyContent: isMDDevice ? 'flex-end' : 'center'}}>
        <Button
          variant="contained"
          color="error"
          onClick={handleCloseDialog}
          startIcon={<CancelIcon />}
          size="small"
          sx={{minWidth: '120px'}}
        >
          Hủy
        </Button>
        <LoadingButton
          variant="contained"
          type="submit"
          form="dialog_form_update_version"
          loading={isSubmitting}
          startIcon={<CheckCircleIcon />}
          size="small"
          sx={{minWidth: '120px'}}
        >
          Cập nhật
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditVersionDialog;
