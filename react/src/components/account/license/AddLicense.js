import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { server_ip } from "../../../variablesSetting"

const AddLicense = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let lc = (localStorage.getItem("license")?localStorage.getItem("license"):data.get("license"))
    console.log({
      license: lc,
    });
    const res = await fetch(server_ip + "/user/addlicense", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        license: data.get("license"),
      }),
    });
    if (res.error === true) {
      alert("FAILLL");
    }
    localStorage.setItem("license", lc);
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div  className="px-20 py-30">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="license"
          label="License"
          name="license"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add license
        </Button>
      </Box>
    </div>
  );
};

export default AddLicense;
