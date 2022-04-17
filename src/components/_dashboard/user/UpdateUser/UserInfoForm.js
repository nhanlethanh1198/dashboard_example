import {memo} from "react";
import {Box, FormControl, Input, InputBase, InputLabel, MenuItem, Select} from "@mui/material";
import {Controller, FormProvider} from "react-hook-form";
import Label from 'src/components/Label'
import {useSnackbar} from 'notistack'

const UserForm = memo(({methods}) => {
    const {enqueueSnackbar} = useSnackbar()
    const {control, register, handleSubmit} = methods;

    const onSubmit = (data) => {
        console.log(data);
        enqueueSnackbar('Cập nhật thông tin thành công!', {variant: 'success'})
    };

    const onError = (data) => {
        console.error(data);
        enqueueSnackbar("Thông tin nhập lỗi, mời thử lại!", {variant: 'error'})
    };

    return (
        <FormProvider {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmit, onError)}>
                <FormControl>
                    <InputLabel id="fullname">Tên khách hàng:</InputLabel>
                    <Input type="text" labelId="fullname" {...register("fullname")} />
                </FormControl>
                <FormControl>
                    <InputLabel id="email">Email:</InputLabel>
                    <Input type="email" labelId="email" {...register("email")} />
                </FormControl>
                <FormControl>
                    <InputLabel id="phone">Số điện thoại:</InputLabel>
                    <Input type="text" labelId="phone" {...register("phone")} />
                </FormControl>
                <FormControl>
                    <InputLabel id="address">Địa chỉ:</InputLabel>
                    <Input type="text" labelId="address" {...register("address")} />
                </FormControl>
                <FormControl>
                    <InputLabel id="address">Trạng thái</InputLabel>
                    <Controller
                        name="is_active"
                        control={control}
                        render={({field}) => {
                            return (
                                <Select
                                    {...field}
                                    input={<InputBase p={0}/>}
                                    defaultValue={field.value}
                                    renderValue={(selected) => {
                                        return (
                                            <Label color={selected ? "success" : "error"}>
                                                {selected ? "Đang hoạt động" : "Đã khóa"}
                                            </Label>
                                        );
                                    }}
                                >
                                    <MenuItem value={true}>Hoạt động</MenuItem>
                                    <MenuItem value={false}>Khóa</MenuItem>
                                </Select>
                            );
                        }}
                    />
                </FormControl>
            </Box>
        </FormProvider>
    );
});

export default UserForm