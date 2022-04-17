import { Box, Skeleton } from "@mui/material";

const Loading = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ maxWidth: "90%", minWidth: "30%", height: 15, marginBottom: 2 }}
      />
    </Box>
  );
};

export default Loading;
