import * as y from 'yup';

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const UpdateProductSchema = y.object().shape({
  name: y.string().required('Tên sản phẩm là bắt buộc!'),
  category_id: y.number().typeError('Bạn phải nhập số vào trường này.'),
  unit: y.string().required('Đơn vị là bắt buộc!'),
  belong_to_store: y.string().required('Chọn nhà cung cấp cho sản phẩm.'),
  weight: y.number().typeError('Cân nặng phải là số.').required('Cân nặng là bắt buộc.'),
  stock: y.number().typeError('Tồn kho phải là số.').required('Tồn kho là bắt buộc.'),
  price: y.number().typeError('Giá sản phẩm phải là số.').required('Giá sản phẩm là bắt buộc.'),
  sale_price: y.number().typeError('Giá bán phải là số.'),
  description: y.string(),
  note: y.string(),
  tag: y.string(),
  brand: y.string(),
  guide: y.string(),
  preserve: y.string(),
  make_in: y.string(),
  make_by: y.string(),
  day_to_shipping: y.string(),
  avatar_img: y
    .mixed()
    .test('file', 'Ảnh đại diện là bắt buộc!', async (value) => {
      const file = await value[0];
      return Boolean(file);
    })
    .test('fileSize', 'Kích thước ảnh đại diện quá lớn', async (value) => {
      const file = await value[0];
      if (file !== undefined) {
        const size = await file.size;
        console.log(size);
        return (await size) < FILE_SIZE;
      }
    })
    .test('fileType', 'Không đúng định dạng ảnh', async (value) => {
      const file = await value[0];
      if (file !== undefined) {
        const type = file.type;
        return await SUPPORTED_FORMATS.includes(type);
      }
    }),
});

export default UpdateProductSchema;
