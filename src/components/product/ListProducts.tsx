import { Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { getProduct, updateProduct } from "../../api/product";
import { Product } from "../../models/productModel";
import Loader from "../Loader";
import EditProductForm from "./editProductForm";
import Swal from "sweetalert2";
import numberFormat from "../../utils/formatCurrency";

function ListProducts() {
  const user: null | {
    token: string;
    refresh_token: string;
    login_date: string;
    expired: number;
  } = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")!)
    : null;
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalEditValue, setModalEditValue] = useState(false);
  const [dataEditModal, setdataEditModal] = useState({
    id: 0,
    label: "",
    value: 0,
  });

  const calculateStock = (product: Product) => {
    let total = 0;
    product.skus.forEach((element) => {
      total += element.quantity;
    });
    return total;
  };
  const handleOpenModal =
    (label: string, id: number, value: number) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setdataEditModal({ id: id, label: label, value: value });
      setModalEditValue(true);
    };
  const handleCloseModal = () => setModalEditValue(false);
  const columnsTable: GridColDef[] = [
    { field: "id", headerName: "ID", width: 130 },
    {
      field: "productInfo",
      headerName: "Info Produk",
      width: 400,
      renderCell: (params) => {
        const paramsParsed = JSON.parse(params.value);
        return (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              component="img"
              sx={{
                my: "12.5px",
                height: 75,
                width: 75,
                maxHeight: { xs: 75, md: 75 },
                maxWidth: { xs: 75, md: 75 },
              }}
              alt="image product"
              src={paramsParsed.images ? paramsParsed.images[0] : ""}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                gap: 1,
                my: "12.5px",
              }}
            >
              <p style={{ margin: 0 }}>{paramsParsed.name}</p>
              <p style={{ margin: 0, color: "gray" }}>
                SKU Seller: {paramsParsed.sku}
              </p>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "price",
      headerName: "Harga",
      align: "left",
      headerAlign: "left",
      width: 130,
      renderCell: (params) => {
        const paramsParsed = JSON.parse(params.value);

        return (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: "100%",
              height: "100%",
              alignItems: "center",
            }}
          >
            <p>Rp {numberFormat(paramsParsed.value)}</p>
            <IconButton
              onClick={handleOpenModal(
                "price",
                paramsParsed.id,
                paramsParsed.value
              )}
              aria-label="delete"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
    {
      field: "stock",
      headerName: "Stok",
      type: "number",
      align: "left",
      headerAlign: "left",
      width: 130,
      renderCell: (params) => {
        const paramsParsed = JSON.parse(params.value);

        return (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: "100%",
              height: "100%",
              alignItems: "center",
            }}
          >
            <p>{paramsParsed.value}</p>
            <IconButton
              onClick={handleOpenModal(
                "stock",
                paramsParsed.id,
                paramsParsed.value
              )}
              aria-label="delete"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
    { field: "active", headerName: "Status", width: 130 },
    {
      field: "url",
      headerName: "URL",
      width: 130,
      renderCell: (params) => (
        <a
          style={{ whiteSpace: "initial" }}
          target="_blank"
          href={params.value}
        >
          {params.value}
        </a>
      ),
    },
  ];

  const rowsTable = (products: Product[]) => {
    const rowProducts = products.map((item, index) => {
      return {
        id: item.item_id,
        productInfo: JSON.stringify({
          name: item.attributes.name,
          images: item.images,
          sku: item.skus[0].SellerSku,
        }),
        price: JSON.stringify({ id: index, value: item.skus[0].price }),
        stock: JSON.stringify({ id: index, value: calculateStock(item) }),
        active: item.status,
        url: item.skus[0].Url,
      };
    });
    return rowProducts;
  };

  const handleSubmit = async (value: number) => {
    const product = products![dataEditModal.id];
    const data = {
      ItemId: product.item_id,
      SkuId: product.skus[0].SkuId,
      Quantity:
        dataEditModal.label === "stock" ? value : product.skus[0].quantity,
      Price: dataEditModal.label === "price" ? value : product.skus[0].price,
      SalePrice: null,
      SaleStartDate: null,
      SaleEndDate: null,
      MultiWarehouseInventories: null,
    };

    setdataEditModal((prev) => {
      return { ...prev, value: value };
    });

    const response = await updateProduct(data, user!.token);
    if (response?.code === "0") {
      handleCloseModal();
      const validProducts = products?.map((item, index) => {
        const product =
          index === dataEditModal.id
            ? {
                ...item,
                skus: item.skus.map((el) => {
                  return {
                    ...el,
                    quantity:
                      dataEditModal.label === "stock" ? value : el.quantity,
                    price: dataEditModal.label === "price" ? value : el.price,
                  };
                }),
              }
            : item;

        {
          return product;
        }
      });

      setProducts(validProducts!);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil update produk",
      });
    } else
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal update produk",
      });
  };

  useEffect(() => {
    async function getProductHandler(
      accessToken: string,
      limit: string,
      filter: string,
      skuSellerlist: string[]
    ) {
      setIsLoading(true);
      const response = await getProduct(
        accessToken,
        limit,
        filter,
        skuSellerlist
      );
      if (response?.data.products) setProducts(response.data.products);
      setIsLoading(false);
    }

    getProductHandler(user!.token, "50", "", []);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <EditProductForm
        open={modalEditValue}
        handleClose={handleCloseModal}
        dataEditModal={dataEditModal}
        handleSubmit={handleSubmit}
      />
      <Button
        startIcon={<AddIcon />}
        sx={{
          height: "50px",
          margin: "0 auto",
        }}
        variant="contained"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          navigate("product/create");
        }}
      >
        Create Product
      </Button>
      {products && (
        <div style={{ height: "fit-content", width: "100%" }}>
          <DataGrid
            rowHeight={100}
            rows={rowsTable(products!)}
            columns={columnsTable}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      )}
      {isLoading && (
        <Loader
          style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}
        />
      )}
    </Box>
  );
}

export default ListProducts;
