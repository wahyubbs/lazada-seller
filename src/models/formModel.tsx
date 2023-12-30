export interface IForm {
  PrimaryCategory: { value: string; label: string };
  Images: Images;
  Attributes: { any };
  Skus: Skus;
}
interface Skus {
  Sku: Sku[] | null;
}
interface Sku {
  SellerSku: string;
  quantity: string;
  price: string;
  special_price: string;
  special_from_date: string;
  special_to_date: string;
  package_height: string;
  package_length: string;
  package_width: string;
  package_weight: string;
  package_content: string;
  Images: Images;
}

interface Images {
  Image: string[];
}
