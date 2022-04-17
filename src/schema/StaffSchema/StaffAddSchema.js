import * as Yup from 'yup';

const StaffAddSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(5, 'Họ tên phải ít nhất 5 kí tự')
    .required('Họ tên nhân viên là bắt buộc'),
  dob: Yup.date()
    .required('Ngày sinh của nhân viên là bắt buộc')
    .max(new Date(), 'Ngày sinh không được trùng hoặc lớn hơn ngày hôm nay'),
  email: Yup.string().email('Đây không phải là email').required('Email là bắt buộc'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Số điện thoại phải bao gồm 10 chữ số')
    .length(10, 'Số điện thoại phải bao gồm 10 chữ số')
    .required('Số điện thoại là bắt buộc'),
  id_card: Yup.string()
    .matches(/^[0-9]+$/, 'CMND/CCCD phải là số')
    .matches(/^[0-9]{9}$|[0-9]{12}$/, 'CMND/CCCD phải là 9 hoặc 12 chữ số')
    .required('CMND/CCCD là bắt buộc'),
  address: Yup.string().required('Địa chỉ là bắt buộc'),
  role: Yup.string().required('Chức vụ của nhân viên là bắt buộc'),
  password: Yup.string().required('Password là bắt buộc'),
  confirm_password: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Nhập lại không đúng password!'
  ),
  avatar_img: Yup.mixed().required('Ảnh nhân viên là bắt buộc'),
  id_card_img_1: Yup.mixed().required('Ảnh CMND/CCCD mặt trước là bắt buộc'),
  id_card_img_2: Yup.mixed().required('Ảnh CMND/CCCD mặt sau là bắt buộc'),
});

export default StaffAddSchema;
