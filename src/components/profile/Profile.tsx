import { Box } from "@mui/material";
import { useContext } from "react";
import { SellerContext } from "../../context/SellerProvider";

function Profile() {
  const { seller } = useContext(SellerContext)!;

  return (
    <Box>
      <h3>Seller name : {seller?.name}</h3>
      <h3>Seller id : {seller?.seller_id}</h3>
      <h3>Seller email : {seller?.email}</h3>
      <h3>Status : {seller?.status}</h3>
      <h3>Verified : {seller?.verified ? seller?.verified : "none"}</h3>
      <h3>Short code : {seller?.short_code}</h3>
    </Box>
  );
}

export default Profile;
