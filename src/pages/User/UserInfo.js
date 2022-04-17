import {
  Card,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { getUserInfoById } from "src/api/user";
import Page from "src/components/Page";
import { useState, useEffect } from "react";
import { ShowUserInfo } from "src/components/_dashboard/user";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from 'notistack'

const UserInfo = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState();
  const { enqueueSnackbar } = useSnackbar()

  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
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
    return () => { };
  }, [id, enqueueSnackbar]);

  return (
    <Page title="Thông tin người dùng">
      <Container>
        <Stack>
          <Typography variant="h3">Thông tin người dùng</Typography>
        </Stack>
        <Grid container mt={3}>
          <Grid item xs={12}>
            <Card mt={3} sx={{ p: 3 }}>
              {isEmpty(userInfo) ? (
                <LinearProgress sx={{ height: "10px" }} />
              ) : (
                <>
                  <ShowUserInfo user={userInfo} />
                  <Stack mt={3}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={() => navigate(-1, { replace: true })}
                      sx={{ width: matches ? "150px" : "auto" }}
                    >
                      Trở về
                    </Button>
                  </Stack>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default UserInfo;
