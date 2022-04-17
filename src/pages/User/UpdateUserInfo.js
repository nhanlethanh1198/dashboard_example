import { memo, useState, useEffect } from "react";
import { Container, Grid } from "@mui/material";
import Page from "src/components/Page";
import { useParams } from "react-router-dom";
import { getUserInfoById } from "src/api/user";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import { UpdateUserInfoSchema } from "src/schema/UserSchema";
import { UserInfoForm } from "src/components/_dashboard/user/UpdateUser";
import { useSnackbar } from "notistack";

const UpdateUserInfo = memo(() => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar()

  const [userInfo, setUserInfo] = useState({
    address: "", //
    created_at: "",
    dob: "",
    email: "", //
    fullname: "", //
    id: 1,
    is_active: false,
    phone: "", //
  });

  useEffect(() => {
    Promise.all([getUserInfoById(id)])
      .then((res) => {
        const data = res[0].data.data;
        setUserInfo(data);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Tải thông tin người dùng thất bại! Mời thử lại!', { variant: 'error' })
      });
    return () => { }
    // eslint-disable-next-line
  }, []);

  const methods = useForm({
    defaultValues: {
      ...userInfo,
    },
    mode: "onChange",
    resolver: yupResolver(UpdateUserInfoSchema),
  });

  const { control } = methods

  return (
    <>
      <Page title="Sửa thông tin khách hàng">
        <Container>
          <Grid container>
            <Grid item xs={12}>
              <UserInfoForm methods={methods} />
            </Grid>
          </Grid>
        </Container>
      </Page>
      <DevTool control={control} />
    </>
  );
});

export default UpdateUserInfo;
