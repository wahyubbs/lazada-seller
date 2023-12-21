import { baseAPI } from "./baseAPI";

export async function generateToken(code: string) {
  try {
    const response = await baseAPI.get(`/token/create?code=${code}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}
