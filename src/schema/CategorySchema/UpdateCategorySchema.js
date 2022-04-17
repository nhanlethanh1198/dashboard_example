import * as Yup from 'yup'
const categorySchema = Yup.object().shape({
    // img: Yup.mixed().required('Ảnh danh mục là bắt buộc.'),
    name: Yup.string().required('Tên danh mục là bắt buộc.'),
    parent_id: Yup.string()
        .matches(/^[0-9]*$/, 'Định dạng nhập không đúng!')
        .required('Hãy chọn danh mục cha!'),
})

export default categorySchema