import { baseAPI } from "./baseAPI";

export async function getProduct(
  accessToken: string,
  limit: string,
  filter: string,
  skuSellerlist: string[]
) {
  try {
    const response = await baseAPI.post(
      "/product/get",
      {
        access_token: accessToken,
        limit,
        filter,
        sku_seller_list: JSON.stringify(skuSellerlist),
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createProduct(form: any, accessToken: string) {
  try {
    const response = await baseAPI.post(
      "/product/create",
      { form: form, access_token: accessToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function updateProduct(data: any, accessToken: string) {
  try {
    const response = await baseAPI.post(
      "/product/update",
      { data: data, access_token: accessToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function getCategoryTree(accessToken: string) {
  try {
    const response = await baseAPI.post(
      "/product/categorytree",
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
export async function getCategoryAttribute(
  accessToken: string,
  primaryCategoryCode: string
) {
  try {
    const response = await baseAPI.post(
      "/product/categoryattribute",
      { access_token: accessToken, primary_category_id: primaryCategoryCode },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function getBrand(
  accessToken: string,
  startRow: string,
  pageSize: string
) {
  try {
    const response = await baseAPI.post(
      "/product/brand",
      { access_token: accessToken, start_row: startRow, page_size: pageSize },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function uploadImageProduct(image: any, accessToken: string) {
  try {
    const response = await baseAPI.post(
      "/image/upload",
      { image: image, access_token: accessToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
