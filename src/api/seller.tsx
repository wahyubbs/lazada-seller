import { baseAPI } from "./baseAPI";

export async function getSellerInfo(accessToken: string) {
  try {
    const response = await baseAPI.post(
      "/seller/info",
      { access_token: accessToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
