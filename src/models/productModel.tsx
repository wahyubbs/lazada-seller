export interface Product {
  created_time: string;
  updated_time: string;
  images: string[];
  skus: Skus[];
  item_id: number;
  trialProduct: boolean;
  primary_category: number;
  marketImages: any[];
  attributes: Attributes;
  status: string;
}
interface Attributes {
  description: string;
  short_description: string;
  brand: string;
  model: string;
  material: string;
  name: string;
  source: string;
  delivery_option_sof: string;
}
interface Skus {
  Status: string;
  quantity: number;
  Images: any[];
  SellerSku: string;
  ShopSku: string;
  Url: string;
  saleProp: SaleProp;
  multiWarehouseInventories: MultiWarehouseInventory[];
  package_width: string;
  package_height: string;
  fblWarehouseInventories: any[];
  special_price: number;
  price: number;
  channelInventories: any[];
  package_length: string;
  Available: number;
  package_weight: string;
  SkuId: number;
}
interface MultiWarehouseInventory {
  occupyQuantity: number;
  quantity: number;
  totalQuantity: number;
  withholdQuantity: number;
  warehouseCode: string;
  sellableQuantity: number;
}
interface SaleProp {}
