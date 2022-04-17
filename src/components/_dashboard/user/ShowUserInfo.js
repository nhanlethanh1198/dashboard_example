import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";
import Label from "src/components/Label";
import moment from "moment-timezone";

const RowInfo = ({ label, value, type = "normal" }) => {

  const resultValue = (type, value) => {
    if (type === "date") {
      return moment(value).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
    }
    return value;
  };

  return (
    <>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6" color="text.primary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        {type === "status" ? (
          <Label color={value ? "primary" : "error"}>
            {value ? "Đang hoạt động" : "Đã khóa"}
          </Label>
        ) : (
          !!value && (
            <Typography variant="body1">{resultValue(type, value)}</Typography>
          )
        )}
      </Grid>
    </>
  );
};

const ShowUserInfo = ({ user }) => {
  return (
    <Grid container spacing={2}>
      <RowInfo label="ID khách hàng:" value={user?.id} />
      <RowInfo label="Tên khách hàng:" value={user?.fullname} />
      <RowInfo label="Số điện thoại:" value={user?.phone} />
      <RowInfo label="Email:" value={user?.email} />
      <RowInfo label="Địa chỉ:" value={user?.address} />
      <RowInfo label="Ngày sinh:" value={user?.dob} type='date' />
      <RowInfo
        label="Ngày tạo tài khoản:"
        value={user?.created_at}
        type="date"
      />
      <RowInfo
        label="Trạng thái tài khoản:"
        value={user?.is_active}
        type="status"
      />
    </Grid>
  );
};

ShowUserInfo.propsType = {
  user: PropTypes.object,
};

export default ShowUserInfo;
