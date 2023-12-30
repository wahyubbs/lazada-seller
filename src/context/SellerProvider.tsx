import { createContext, useState } from "react";

type Seller = {
  name: string;
  verified: boolean;
  seller_id: number;
  email: string;
  short_code: string;
  cb: boolean;
  status: string;
};
type SellerContextType = {
  setSeller: React.Dispatch<React.SetStateAction<Seller | null>>;
  seller: Seller | null;
  // ...
};
export const SellerContext = createContext<SellerContextType | null>(null);

function SellerContextProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useState<Seller | null>(null);
  return (
    <SellerContext.Provider value={{ seller, setSeller }}>
      {children}
    </SellerContext.Provider>
  );
}

export default SellerContextProvider;
