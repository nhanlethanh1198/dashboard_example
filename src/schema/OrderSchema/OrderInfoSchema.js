import * as y from 'yup';

const OrderInfoSchema = y.object().shape({
  fullname: y.string().required('Bạn không được bỏ trống tên khách hàng!'),
  phone: y
    .string()
    .matches(/^[0-9]+$/, 'Số điện thoại phải bao gồm 10 chữ số')
    .length(10, 'Số điện thoại phải bao gồm 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  address_delivery: y.string().required('Địa chỉ là bắt buộc'),
});

export default OrderInfoSchema;
