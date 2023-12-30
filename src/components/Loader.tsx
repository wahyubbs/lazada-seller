import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";

function Loader({
  style = { minHeight: "100vh", display: "flex", alignItems: "center" },
}: {
  style: SxProps<Theme>;
}) {
  return (
    <Box sx={style}>
      <CircularProgress sx={{ display: "block", margin: "auto" }} />
    </Box>
  );
}

export default Loader;
