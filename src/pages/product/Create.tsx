import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { NestedMenuItem } from "mui-nested-menu";
import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  getBrand,
  getCategoryAttribute,
  getCategoryTree,
  uploadImageProduct,
} from "../../api/product";
import AddIcon from "@mui/icons-material/Add";
import { IForm } from "../../models/formModel";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

enum FormType {
  ATTRIBUT,
  CATEGORY,
  SKU,
  IMAGES,
}

enum TypeSearch {
  BRAND,
}
const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  
 
`
);

function CreateProduct() {
  const data: null | {
    token: string;
    refresh_token: string;
    login_date: string;
    expired: number;
  } = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")!)
    : null;

  const navigate = useNavigate();
  const [form, setForm] = useState({
    PrimaryCategory: { value: "", label: "" },
    Images: {
      Image: [
        "https://sg-test-11.slatic.net/p/df43a20901802b1c223382951138719f.jpg",
      ],
    },
    Attributes: {
      name: "",
      description: "",
      brand: "",
      model: "",
      warranty: "",
      short_description: "",
      Hazmat: "",
      delivery_option_sof: "No",
      name_engravement: "Yes",
      gift_wrapping: "Yes",
      preorder_enable: "No",
      preorder_days: "",
    },
    Skus: {
      Sku: [
        {
          SellerSku: "",
          quantity: 0,
          price: 0,
          special_price: "",
          special_from_date: "",
          special_to_date: "",
          package_height: "",
          package_length: "",
          package_width: "",
          package_weight: "",
          package_content: "",
          Images: {
            Image: [
              "https://sg-test-11.slatic.net/p/df43a20901802b1c223382951138719f.jpg",
            ],
          },
        },
      ],
    },
  });
  const [categoryTree, setCategoryTree] = useState<any | null>(null);
  const [categoryAttribute, setCategoryAttribute] = useState<any[] | null>(
    null
  );

  const [images, setImages] = useState<File[] | null>(null);
  const [byteImage, setByteImage] = useState<Uint8Array | null>(null);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(
    null
  );
  const open = Boolean(anchorEl);

  ///search input
  const [listBrand, setListBrand] = useState<any[] | null>(null);
  const [visible, setVisible] = useState({
    brand: false,
  });

  const [selectedItem, setSelectedItem] = useState({
    brand: "",
  });
  const dropdownBrandRef = useRef<HTMLDivElement>(null);

  const handleChangeSearch = (type: TypeSearch) => (e: any) => {
    if (type == TypeSearch.BRAND) {
      setForm((prev) => {
        prev["Attributes"]["brand"] = e.target.value;
        return { ...prev };
      });

      if (!visible.brand) {
        setVisible((prev) => {
          return { ...prev, from: true };
        });
      }
      setSelectedItem((prev) => {
        return { ...prev, brand: "" };
      });
      // setErrors((prev) => {
      //   return {
      //     ...prev,
      //     BRAB: false,
      //   };
      // });
    }
  };

  const handleChange =
    (type: FormType, item: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      if (type == FormType.CATEGORY) {
        setForm((prev) => {
          return {
            ...prev,
            PrimaryCategory: e.target.value,
          };
        });
      } else if (type == FormType.ATTRIBUT) {
        setForm((prev) => {
          prev["Attributes"][item] = e.target.value;
          return { ...prev };
        });
      } else if (type == FormType.SKU) {
        const regex = /^[0-9\b]+$/;
        if (
          (item === "quantity" &&
            regex.test(e.target.value.replace(/\s/g, "")) === true) ||
          (item === "price" &&
            regex.test(e.target.value.replace(/\s/g, "")) === true) ||
          (item === "package_weight" &&
            regex.test(e.target.value.replace(/\s/g, "")) === true) ||
          (item === "package_width" &&
            regex.test(e.target.value.replace(/\s/g, "")) === true) ||
          (item === "package_length" &&
            regex.test(e.target.value.replace(/\s/g, "")) === true) ||
          (item === "package_height" &&
            regex.test(e.target.value.replace(/\s/g, "")) === true)
        ) {
          setForm((prev) => {
            const templateSku = {
              SellerSku: "",
              quantity: "",
              price: "",
              special_price: "",
              special_from_date: "",
              special_to_date: "",
              package_height: "",
              package_length: "",
              package_width: "",
              package_weight: "",
              package_content: "",
              Images: {
                Image: [
                  "https://sg-test-11.slatic.net/p/df43a20901802b1c223382951138719f.jpg",
                ],
              },
            };
            const skus = form.Skus.Sku
              ? [{ ...form.Skus.Sku[0], [item]: e.target.value }]
              : [{ ...templateSku }];
            return {
              ...prev,
              Skus: { Sku: skus },
            };
          });
        } else if (
          item !== "quantity" &&
          item !== "price" &&
          item !== "package_height" &&
          item !== "package_length" &&
          item !== "package_width" &&
          item !== "package_weight"
        ) {
          setForm((prev) => {
            const templateSku = {
              SellerSku: "",
              quantity: "",
              price: "",
              special_price: "",
              special_from_date: "",
              special_to_date: "",
              package_height: "",
              package_length: "",
              package_width: "",
              package_weight: "",
              package_content: "",
              Images: {
                Image: [
                  "https://sg-test-11.slatic.net/p/df43a20901802b1c223382951138719f.jpg",
                ],
              },
            };
            const skus = form.Skus.Sku
              ? [{ ...form.Skus.Sku[0], [item]: e.target.value }]
              : [{ ...templateSku }];
            return {
              ...prev,
              Skus: { Sku: skus },
            };
          });
        }
      }
    };
  const handleChangeOption =
    (type: FormType, item: string) => (e: SelectChangeEvent<string>) => {
      if (type == FormType.ATTRIBUT) {
        setForm((prev) => {
          prev["Attributes"][item] = e.target.value;
          return { ...prev };
        });
      }
    };

  const selectItemSearch = (
    type: TypeSearch,
    item: { label: string; value: string }
  ) => {
    if (type === TypeSearch.BRAND) {
      setForm((prev) => {
        prev["Attributes"]["brand"] = item.label;
        return { ...prev };
      });

      setSelectedItem((prev) => {
        return { ...prev, brand: item.value };
      });
      setVisible((prev) => {
        return { ...prev, brand: false };
      });
      // setErrors((prev) => {
      //   return {
      //     ...prev,
      //     from: false,
      //   };
      // });
    }
  };
  const handleChangeCategory = (
    event: SelectChangeEvent<{ value: string; label: string }>
  ) => {
    const {
      target: { value },
    } = event;
    setForm((prev) => {
      return {
        ...prev,
        PrimaryCategory: value as { value: string; label: string },
      };
    });
    handleCloseCategory;
  };
  const handleClickCategory = (event: React.SyntheticEvent<Element, Event>) => {
    return setAnchorEl(event.currentTarget);
  };
  const handleCloseCategory = () => setAnchorEl(null);

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const byteArray = new Uint8Array(e.target!.result);
      setByteImage(byteArray);
    };

    reader.readAsArrayBuffer(e.target.files![0]);
    setImages((prev) => {
      const newImages = prev
        ? [...prev, e.target.files![0]]
        : [e.target.files![0]];
      return newImages;
    });
  };
  const handleUploadImage = async () => {
    const response = await uploadImageProduct(byteImage, data!.token);
    console.log(response);
  };

  const filterSpesificationProductField = (fields: any[]) => {
    const isValidId = (id: number) => {
      const notValidId = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 30004, 30020, 30082, 40012,
        120074405, 40036, 40039, 40041,
      ];
      const isNotValidId = notValidId.filter((item) => item === id);
      return isNotValidId.length === 0;
    };
    const validFields = fields.filter(
      (item) =>
        item.attribute_type === "normal" && item.id > 50 && isValidId(item.id)
    );
    return validFields;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await createProduct(
      { ...form, PrimaryCategory: form.PrimaryCategory.value },
      data!.token
    );
    if (response?.code === "0") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Berhasil membuat produk",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
    } else
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.detail[0].message,
      });
  };

  useEffect(() => {
    async function getCategoryTreeHandlers(access_token: string) {
      const response = await getCategoryTree(access_token);
      if (response?.data) setCategoryTree(response.data);
    }

    getCategoryTreeHandlers(data!.token);
  }, []);
  useEffect(() => {
    if (byteImage) handleUploadImage();
  }, [byteImage]);

  useEffect(() => {
    async function getCategoryAttributeHandler(
      accessToken: string,
      primaryCategoryCode: string
    ) {
      const response = await getCategoryAttribute(
        accessToken,
        primaryCategoryCode
      );
      if (response?.data) setCategoryAttribute(response.data);
    }
    if (form.PrimaryCategory && form.PrimaryCategory?.value !== "")
      getCategoryAttributeHandler(data!.token, form.PrimaryCategory.value);
  }, [form.PrimaryCategory]);

  // useEffect(() => {
  //   async function getBrandHandler(
  //     accessToken: string,
  //     startRow: string,
  //     pageSize: string
  //   ) {
  //     const response = await getBrand(accessToken, startRow, pageSize);
  //     console.log(response);
  //   }
  //   if (searchValue.brand !== "") getBrandHandler(data!.token, "200", "200");
  // }, [searchValue]);
  return (
    <Container>
      <Box
        sx={{
          backgroundColor: "#ebecf0",
          my: 2,
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h4" marginBottom={1}>
          Informasi Dasar
        </Typography>

        <TextField
          required
          sx={{
            position: "relative",
            width: "100%",
          }}
          id="name"
          // error={errors.from}
          label="Nama Produk"
          // helperText={errors.from && "harap isi kota asal"}
          variant="outlined"
          value={form.Attributes.name}
          onChange={handleChange(FormType.ATTRIBUT, "name")}
        />
        <FormControl hiddenLabel fullWidth>
          <Select
            displayEmpty
            renderValue={(value) => value.label || "Kategori"}
            value={form.PrimaryCategory ? form.PrimaryCategory : ""}
            open={open}
            onOpen={handleClickCategory}
            onClose={handleCloseCategory}
            onChange={handleChangeCategory}
          >
            {categoryTree &&
              categoryTree.map((item, index: number) => {
                return (
                  <MenuItem
                    sx={{
                      width: item.children ? "fit-content" : "100%",
                      display: item.children ? "none" : "inherit",
                    }}
                    key={index}
                    value={{ value: item.category_id, label: item.name }}
                  >
                    {item.name}
                  </MenuItem>
                );
              })}
            {categoryTree &&
              categoryTree
                .filter((item) => item.children)
                .map((item, index: number) => {
                  return (
                    <NestedMenuItem
                      key={index}
                      sx={{ width: "fit-content" }}
                      label={item.name}
                      parentMenuOpen={open}
                    >
                      {item.children &&
                        item.children.map(
                          (itemChildren, indexChildren: number) => {
                            if (!itemChildren.children)
                              return (
                                <MenuItem
                                  sx={{
                                    width: "fit-content",
                                  }}
                                  key={indexChildren}
                                  data-value={itemChildren.category_id}
                                  onClick={(e) => {
                                    setForm((prev) => {
                                      return {
                                        ...prev,
                                        PrimaryCategory: {
                                          value: itemChildren.category_id,
                                          label: itemChildren.name,
                                        },
                                      };
                                    });
                                    handleCloseCategory();
                                  }}
                                >
                                  {itemChildren.name}
                                </MenuItem>
                              );
                            else
                              return (
                                <NestedMenuItem
                                  key={indexChildren}
                                  sx={{ width: "fit-content" }}
                                  label={itemChildren.name}
                                  parentMenuOpen={open}
                                >
                                  {itemChildren.children.map(
                                    (itemChildren2, indexChildren2: number) => {
                                      if (!itemChildren2.children)
                                        return (
                                          <MenuItem
                                            sx={{
                                              width: "fit-content",
                                            }}
                                            key={indexChildren2}
                                            data-value={
                                              itemChildren2.category_id
                                            }
                                            onClick={(e) => {
                                              setForm((prev) => {
                                                return {
                                                  ...prev,
                                                  PrimaryCategory: {
                                                    value:
                                                      itemChildren2.category_id,
                                                    label: itemChildren2.name,
                                                  },
                                                };
                                              });
                                              handleCloseCategory();
                                            }}
                                          >
                                            {itemChildren2.name}
                                          </MenuItem>
                                        );
                                      else
                                        return (
                                          <NestedMenuItem
                                            key={indexChildren2}
                                            sx={{ width: "fit-content" }}
                                            label={itemChildren2.name}
                                            parentMenuOpen={open}
                                          >
                                            {itemChildren2.children.map(
                                              (
                                                itemChildren3,
                                                indexChildren3: number
                                              ) => {
                                                if (!itemChildren3.children)
                                                  return (
                                                    <MenuItem
                                                      sx={{
                                                        width: "fit-content",
                                                      }}
                                                      key={indexChildren3}
                                                      data-value={
                                                        itemChildren3.category_id
                                                      }
                                                      onClick={(e) => {
                                                        setForm((prev) => {
                                                          return {
                                                            ...prev,
                                                            PrimaryCategory: {
                                                              value:
                                                                itemChildren3.category_id,
                                                              label:
                                                                itemChildren3.name,
                                                            },
                                                          };
                                                        });
                                                        handleCloseCategory();
                                                      }}
                                                    >
                                                      {itemChildren3.name}
                                                    </MenuItem>
                                                  );
                                                else
                                                  return (
                                                    <NestedMenuItem
                                                      key={indexChildren3}
                                                      sx={{
                                                        width: "fit-content",
                                                      }}
                                                      label={itemChildren3.name}
                                                      parentMenuOpen={open}
                                                    >
                                                      {itemChildren3.children.map(
                                                        (
                                                          itemChildren4,
                                                          indexChildren4: number
                                                        ) => {
                                                          if (
                                                            !itemChildren4.children
                                                          )
                                                            return (
                                                              <MenuItem
                                                                sx={{
                                                                  width:
                                                                    "fit-content",
                                                                }}
                                                                key={
                                                                  indexChildren4
                                                                }
                                                                data-value={
                                                                  itemChildren4.category_id
                                                                }
                                                                onClick={(
                                                                  e
                                                                ) => {
                                                                  setForm(
                                                                    (prev) => {
                                                                      return {
                                                                        ...prev,
                                                                        PrimaryCategory:
                                                                          {
                                                                            value:
                                                                              itemChildren4.category_id,
                                                                            label:
                                                                              itemChildren4.name,
                                                                          },
                                                                      };
                                                                    }
                                                                  );
                                                                  handleCloseCategory();
                                                                }}
                                                              >
                                                                {
                                                                  itemChildren4.name
                                                                }
                                                              </MenuItem>
                                                            );
                                                          else
                                                            return (
                                                              <NestedMenuItem
                                                                key={
                                                                  indexChildren4
                                                                }
                                                                sx={{
                                                                  width:
                                                                    "fit-content",
                                                                }}
                                                                label={
                                                                  itemChildren4.name
                                                                }
                                                                parentMenuOpen={
                                                                  open
                                                                }
                                                              >
                                                                {itemChildren4.children.map(
                                                                  (
                                                                    itemChildren5,
                                                                    indexChildren5: number
                                                                  ) => {
                                                                    return (
                                                                      <MenuItem
                                                                        sx={{
                                                                          width:
                                                                            "fit-content",
                                                                        }}
                                                                        key={
                                                                          indexChildren5 *
                                                                          4
                                                                        }
                                                                        data-value={
                                                                          itemChildren5.category_id
                                                                        }
                                                                        onClick={(
                                                                          e
                                                                        ) => {
                                                                          setForm(
                                                                            (
                                                                              prev
                                                                            ) => {
                                                                              return {
                                                                                ...prev,
                                                                                PrimaryCategory:
                                                                                  {
                                                                                    value:
                                                                                      itemChildren5.category_id,
                                                                                    label:
                                                                                      itemChildren5.name,
                                                                                  },
                                                                              };
                                                                            }
                                                                          );
                                                                          handleCloseCategory();
                                                                        }}
                                                                      >
                                                                        {
                                                                          itemChildren5.name
                                                                        }
                                                                      </MenuItem>
                                                                    );
                                                                  }
                                                                )}
                                                              </NestedMenuItem>
                                                            );
                                                        }
                                                      )}
                                                    </NestedMenuItem>
                                                  );
                                              }
                                            )}
                                          </NestedMenuItem>
                                        );
                                    }
                                  )}
                                </NestedMenuItem>
                              );
                          }
                        )}
                    </NestedMenuItem>
                  );
                })}
          </Select>
        </FormControl>
        <p>Foto produk</p>
        <Box
          sx={{
            backgroundColor: "#f5f8fd",
            borderRadius: "5px",
            p: 2,
            mt: "-1rem",
          }}
        >
          <input
            color="primary"
            accept="image/*"
            type="file"
            onChange={handleChangeImage}
            id="icon-button-file"
            style={{ display: "none" }}
          />
          <label htmlFor="icon-button-file">
            <Button
              variant="contained"
              component="span"
              size="large"
              color="primary"
            >
              <AddIcon />
            </Button>
          </label>
        </Box>
      </Box>
      {categoryAttribute && (
        <Box
          sx={{
            backgroundColor: "#ebecf0",
            my: 2,
            p: 3,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h4" marginBottom={1}>
            Spesifikasi Produk
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(2, 1fr)",
            }}
          >
            {filterSpesificationProductField(categoryAttribute).map(
              (item, index) => {
                if (item.input_type === "singleSelect" && item.name === "brand")
                  return (
                    <Box
                      key={index}
                      sx={{
                        maxWidth: { xs: "100%", md: "sm" },
                      }}
                    >
                      <TextField
                        required
                        sx={{
                          position: "relative",
                          width: "100%",
                        }}
                        id="from"
                        // error={errors.from}
                        label={item.label}
                        // helperText={errors.from && "harap isi kota asal"}
                        variant="outlined"
                        value={form.Attributes.brand}
                        onChange={handleChangeSearch(TypeSearch.BRAND)}
                        onFocus={() => {
                          setVisible((prev) => {
                            return { ...prev, brand: true };
                          });
                        }}
                      />

                      <Box
                        ref={dropdownBrandRef}
                        sx={{
                          position: "absolute",
                          zIndex: 2,
                        }}
                      >
                        {visible.brand && (
                          <nav aria-label="main mailbox folders">
                            <List>
                              {listBrand &&
                                listBrand.map((item, index: number) => (
                                  <ListItem disablePadding key={index}>
                                    <ListItemButton
                                      onClick={(
                                        e: React.MouseEvent<HTMLElement>
                                      ) => {
                                        e.preventDefault();
                                        selectItemSearch(
                                          TypeSearch.BRAND,
                                          item
                                        );
                                      }}
                                    >
                                      <ListItemText primary={item.label} />
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                            </List>
                          </nav>
                        )}
                      </Box>
                    </Box>
                  );
                else if (
                  item.input_type === "singleSelect" &&
                  item.name !== "brand"
                )
                  return (
                    <TextField
                      required
                      sx={{
                        position: "relative",
                        width: "100%",
                      }}
                      id={item.name}
                      // error={errors.from}
                      label={item.label}
                      // helperText={errors.from && "harap isi kota asal"}
                      variant="outlined"
                      value={
                        form.Attributes[item.name]
                          ? form.Attributes[item.name]
                          : ""
                      }
                      onChange={handleChange(FormType.ATTRIBUT, item.name)}
                    />
                  );
                else if (item.input_type === "enumInput")
                  return (
                    <FormControl key={index} sx={{ width: "100%" }}>
                      <InputLabel id={item.name}>{item.label}</InputLabel>
                      <Select
                        labelId={item.label}
                        id={item.label}
                        value={
                          form.Attributes[item.name]
                            ? form.Attributes[item.name]
                            : ""
                        }
                        label={item.label}
                        onChange={handleChangeOption(
                          FormType.ATTRIBUT,
                          item.name
                        )}
                      >
                        {item.options.map((option, index: number) => (
                          <MenuItem key={index} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
              }
            )}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: "#ebecf0",
          my: 2,
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h4" marginBottom={1}>
          Harga, Stok & Varian
        </Typography>
        <p>* Harga & Stok</p>
        <TableContainer sx={{ marginTop: "-1rem" }} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">* Harga</TableCell>
                <TableCell align="center">Stok</TableCell>
                <TableCell align="center">Seller SKU</TableCell>
                {/* <TableCell align="center">Aktif</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  <FormControl sx={{ width: "25ch" }} variant="outlined">
                    <OutlinedInput
                      onChange={handleChange(FormType.SKU, "price")}
                      id="harga"
                      type="text"
                      startAdornment={
                        <InputAdornment position="start">Rp</InputAdornment>
                      }
                      aria-describedby="harga-text"
                      inputProps={{
                        "aria-label": "harga",
                      }}
                      value={form.Skus.Sku[0].price}
                    />
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <FormControl sx={{ width: "25ch" }} variant="outlined">
                    <OutlinedInput
                      id="stock"
                      onChange={handleChange(FormType.SKU, "quantity")}
                      type="text"
                      value={form.Skus.Sku[0].quantity}
                      aria-describedby="harga-text"
                      inputProps={{
                        "aria-label": "stock",
                      }}
                    />
                  </FormControl>
                </TableCell>
                <TableCell
                  sx={{ display: "flex", justifyContent: "center" }}
                  align="center"
                >
                  <FormControl variant="outlined">
                    <OutlinedInput
                      id="sellerSKU"
                      onChange={handleChange(FormType.SKU, "SellerSku")}
                      aria-describedby="sellerSKU-text"
                      inputProps={{
                        "aria-label": "sellerSKU",
                      }}
                    />
                  </FormControl>
                </TableCell>
                {/* <TableCell align="center">button</TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          backgroundColor: "#ebecf0",
          my: 2,
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" component="h4" marginBottom={1}>
          Deskripsi Produk
        </Typography>
        <p style={{ color: "gray" }}>Deskripsi Utama</p>
        <Textarea
          value={form.Attributes.description}
          onChange={handleChange(FormType.ATTRIBUT, "description")}
          minRows={15}
          aria-label="Deskripsi Utama"
          placeholder="Deskripsi Utama"
        />
      </Box>
      <Box
        sx={{
          backgroundColor: "#ebecf0",
          my: 2,
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" component="h4" marginBottom={1}>
          Pengiriman & Garansi
        </Typography>
        <p style={{ color: "gray" }}>Berat Paket</p>
        <FormControl sx={{ width: "50ch" }} variant="outlined">
          <OutlinedInput
            onChange={handleChange(FormType.SKU, "package_weight")}
            id="berat"
            type="text"
            endAdornment={<InputAdornment position="start">Kg</InputAdornment>}
            aria-describedby="berat-text"
            value={form.Skus.Sku[0].package_weight}
            inputProps={{
              "aria-label": "berat",
            }}
          />
        </FormControl>
        <p style={{ color: "gray" }}>
          *Paket Panjang (cm) * Lebar (cm) * Tinggi (cm)
        </p>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          <FormControl variant="outlined">
            <OutlinedInput
              onChange={handleChange(FormType.SKU, "package_length")}
              id="length"
              type="text"
              placeholder="panjang"
              aria-describedby="length-text"
              value={form.Skus.Sku[0].package_length}
              inputProps={{
                "aria-label": "length",
              }}
            />
          </FormControl>
          <FormControl variant="outlined">
            <OutlinedInput
              onChange={handleChange(FormType.SKU, "package_width")}
              id="width"
              type="text"
              placeholder="lebar"
              value={form.Skus.Sku[0].package_width}
              aria-describedby="width-text"
              inputProps={{
                "aria-label": "width",
              }}
            />
          </FormControl>
          <FormControl variant="outlined">
            <OutlinedInput
              onChange={handleChange(FormType.SKU, "package_height")}
              id="heigth"
              type="text"
              placeholder="tinggi"
              value={form.Skus.Sku[0].package_height}
              aria-describedby="heigth-text"
              inputProps={{
                "aria-label": "heigth",
              }}
            />
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#ebecf0",
          my: 2,
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Button onClick={handleSubmit} variant="contained">
          Kirim
        </Button>
      </Box>
    </Container>
  );
}

export default CreateProduct;
