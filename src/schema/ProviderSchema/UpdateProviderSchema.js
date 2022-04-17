import * as y from 'yup';

const UpdateProviderSchema = y.object().shape({
  name: y.string().typeError('Tên nhà phân phối phải là chuỗi'),
  email: y.string().email('Cần nhập đúng định dạng email'),
  phone: y
    .string()
    .matches(/^[0-9]+$/, 'Số điện thoại phải bao gồm 10 chữ số')
    .length(10, 'Số điện thoại phải bao gồm 10 chữ số'),
  address: y.string().typeError('Địa chỉ nhà cung cấp phải là chuỗi'),
});

export default UpdateProviderSchema;
