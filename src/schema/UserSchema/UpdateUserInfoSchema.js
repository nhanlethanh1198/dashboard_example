import * as y from "yup";

const UpdateUserInfoSchema = y.object.shape({
  fullname: y
    .string()
    .min(5, "Họ tên phải ít nhất 5 kí tự")
    .required("Họ tên nhân viên là bắt buộc"),
  dob: y
    .date()
    .required("Ngày sinh của nhân viên là bắt buộc")
    .max(new Date(), "Ngày sinh không được trùng hoặc lớn hơn ngày hôm nay"),
  email: y
    .string()
    .email("Đây không phải là email")
    .required("Email là bắt buộc"),
  phone: y
    .string()
    .length(10, "Số điện thoại phải bao gồm 10 chữ số")
    .required("Số điện thoại là bắt buộc"),
  address: y.string().required("Địa chỉ là bắt buộc"),
  is_active: y.boolean().required("Trạng thái người dùng là bắt buộc!"),
});

export default UpdateUserInfoSchema;
