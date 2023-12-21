import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Loader() {
  return (
    <Box sx={{ display: "flex", margin: "auto" }}>
      <CircularProgress />
    </Box>
  );
}

export default Loader;
