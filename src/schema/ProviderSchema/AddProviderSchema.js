import * as y from 'yup';

const AddProviderSchema = y.object().shape({
  name: y
    .string()
    .typeError('Tên nhà phân phối phải là chuỗi')
    .required('Không được bỏ trống tên nhà cung cấp'),
  email: y
    .string()
    .email('Cần nhập đúng định dạng email.')
    .required('Không được bỏ trống email nhà cung cấp'),
  phone: y
    .string()
    .matches(/^[0-9]+$/, 'Số điện thoại phải bao gồm 10 chữ số')
    .length(10, 'Số điện thoại phải bao gồm 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  address: y
    .string()
    .typeError('Địa chỉ nhà cung cấp phải là chuỗi')
    .required('Địa chỉ nhà phân phối là bắt buộc.'),
  province_code: y
    .number().required('Tỉnh/Thành phố là bắt buộc.'),
  district_code: y
    .number().required('Quận/Huyện là bắt buộc.'),
});

export default AddProviderSchema;
