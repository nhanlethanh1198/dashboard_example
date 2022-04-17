import { memo } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
// Material
import { experimentalStyled as styled } from "@mui/material/styles";
import {
  Toolbar,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";

// Styled Component
const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8, background: 'white' },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

const UserSearchByPhoneNum = memo(({ register }) => {
  return (
    <RootStyle>
      <SearchStyle
        {...register("phone")}
        placeholder="Tìm theo số điện thoại..."
        startAdornment={
          <InputAdornment position="start">
            <IconButton
              type="submit"
              sx={{ color: "text.disable", width: "30px" }}
            >
              <Icon icon={searchFill} />
            </IconButton>
          </InputAdornment>
        }
      />
    </RootStyle>
  );
});

UserSearchByPhoneNum.propsType = {
  filterPhone: PropTypes.number,
  onFilterPhone: PropTypes.func,
};

export default UserSearchByPhoneNum;
