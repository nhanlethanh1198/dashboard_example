import * as Yup from 'yup';

const StaffSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(5, 'Họ tên phải ít nhất 5 kí tự')
    .required('Họ tên nhân viên là bắt buộc'),
  dob: Yup.date()
    .required('Ngày sinh của nhân viên là bắt buộc')
    .max(new Date(), 'Ngày sinh không được trùng hoặc lớn hơn ngày hôm nay'),
  email: Yup.string().email('Đây không phải là email').required('Email là bắt buộc'),
  id_card: Yup.string()
    .matches(/^[0-9]+$/, 'CMND/CCCD phải là số')
    .matches(/^[0-9]{9}$|[0-9]{12}$/, 'CMND/CCCD phải là 9 hoặc 12 chữ số')
    .required('CMND/CCCD là bắt buộc'),
  address: Yup.string().required('Địa chỉ là bắt buộc'),
  role: Yup.string().required('Chức vụ của nhân viên là bắt buộc'),
  password: Yup.string(),
  confirm_password: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Nhập lại không đúng password!'
  ),
});

export default StaffSchema;
