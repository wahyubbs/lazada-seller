import { Modal, Box, FormControl, OutlinedInput, Button } from "@mui/material";
import { useEffect, useState } from "react";
const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  gap: 1,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function EditProductForm({
  open,
  handleClose,
  dataEditModal,
  handleSubmit,
}: {
  open: boolean;
  handleSubmit: (value: number) => void;
  dataEditModal: {
    label: string;
    value: number;
  };
  handleClose: () => void;
}) {
  const [editValue, setEditValue] = useState(0);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setEditValue(Number(e.target.value));
  };
  const handleSubmitValue = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(editValue);
  };
  useEffect(() => {
    setEditValue(dataEditModal.value);
  }, [dataEditModal.value]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h4 style={{ margin: 0 }}>{dataEditModal.label}</h4>
        <FormControl sx={{ width: "100%" }} variant="outlined">
          <OutlinedInput
            id={dataEditModal.label}
            value={editValue}
            onChange={handleChangeInput}
            type="number"
            aria-describedby={dataEditModal.label}
            inputProps={{
              "aria-label": `${dataEditModal.label}`,
            }}
          />
        </FormControl>
        <Button
          sx={{ width: "fit-content", ml: "auto" }}
          onClick={handleSubmitValue}
          variant="contained"
        >
          Update
        </Button>
      </Box>
    </Modal>
  );
}

export default EditProductForm;
