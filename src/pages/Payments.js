import UploadIcon from "@mui/icons-material/Upload";
import { LoadingButton, TabContext, TabPanel } from "@mui/lab";
import { Button, IconButton, Paper, Tab, Tabs, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import useNotistack from "../hooks/useNotistack";
import SaveIcon from '@mui/icons-material/Save';
import {
  GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH,
  PATCH_WITH_AUTH_UPDATE_PAYMENT_INFO_ENDPOINT_PATH,
  SERVER_URL,
} from "../utils/Endpoints";

function Payments() {
  const [value, setValue] = useState("1");
  const [uploadData, setUploadData] = useState({
    momoQRCodeImageFile: null,
    momoQRCodePreviewUrl: "",
    bankQRCodeImageFile: null,
    bankQRCodePreviewUrl: "",
    paypalDonationLink: "",
  });
  const { fetchWithCredentialsAsync } = useFetch();
  const { showSnackbar } = useNotistack();
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function showPreviewMomo(e) {
    setUploadData((uploadData) => ({
      ...uploadData,
      momoQRCodePreviewUrl: URL.createObjectURL(e.target.files[0]),
      momoQRCodeImageFile: e.target.files[0],
    }));
  }

  function handleCancelMomo() {
    setUploadData((uploadData) => ({
      ...uploadData,
      momoQRCodePreviewUrl: "",
      momoQRCodeImageFile: null,
    }));
  }

  function showPreviewBank(e) {
    setUploadData((uploadData) => ({
      ...uploadData,
      bankQRCodePreviewUrl: URL.createObjectURL(e.target.files[0]),
      bankQRCodeImageFile: e.target.files[0],
    }));
  }

  function handleCancelBank() {
    setUploadData((uploadData) => ({
      ...uploadData,
      bankQRCodePreviewUrl: "",
      bankQRCodeImageFile: null,
    }));
  }

  useEffect(() => {
    fetchUserInfoAsync();
  }, []);

  async function fetchUserInfoAsync() {
    try {
      const userInfoResponse = await fetchWithCredentialsAsync(
        `${SERVER_URL}${GET_WITH_AUTH_USER_INFO_ENDPOINT_PATH}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const userInfoResponseData = await userInfoResponse.json();

      if (userInfoResponse.status === 200) {
        setUploadData({
          momoQRCodeImageFile: null,
          momoQRCodePreviewUrl: userInfoResponseData?.data?.momoQRCode,
          bankQRCodeImageFile: null,
          bankQRCodePreviewUrl: userInfoResponseData?.data?.bankQRCode,
          paypalDonationLink:
            userInfoResponseData?.data?.paypalDonationLink ?? "",
        });
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
  }

  async function updateYourPaymentsAsync() {
    setLoading(true);
    try {
      const formData = new FormData();
      if (uploadData.momoQRCodeImageFile) {
        formData.append("MomoQRCodeImageFile", uploadData.momoQRCodeImageFile);
      }
      if (uploadData.bankQRCodeImageFile) {
        formData.append("BankQRCodeImageFile", uploadData.bankQRCodeImageFile);
      }
      formData.append("PaypalDonationLink", uploadData.paypalDonationLink);

      const response = await fetchWithCredentialsAsync(
        `${SERVER_URL}${PATCH_WITH_AUTH_UPDATE_PAYMENT_INFO_ENDPOINT_PATH}`,
        {
          method: "PATCH",
          body: formData,
          redirect: "follow",
        }
      );
      const responseData = await response.json();

      if (response.status === 422) {
        showSnackbar("error", responseData?.message);
      } else if (response.status === 200) {
        showSnackbar("success", responseData?.message);
      } else {
        showSnackbar("error", "Unknown error.");
      }
    } catch (err) {
      showSnackbar("error", err.message);
    }
    setLoading(false);
  }

  return (
    <>
      <h2>Donation settings</h2>
      <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "#e6cfcf",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="lab API tabs example"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab
                  label="Momo"
                  value="1"
                  iconPosition="start"
                  sx={{ textTransform: "none" }}
                />
                <Tab
                  label="Bank"
                  value="2"
                  iconPosition="start"
                  sx={{ textTransform: "none" }}
                />
                <Tab
                  label="Paypal"
                  value="3"
                  iconPosition="start"
                  sx={{ textTransform: "none" }}
                />
              </Tabs>

              <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                color="success"
                onClick={updateYourPaymentsAsync}
                size="small"
              >
                Save changes
              </LoadingButton>
            </Box>
            <TabPanel value="1">
              <Box
                component="div"
                sx={{
                  p: 2,
                  mt: 1,
                  border: "2px dashed grey",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {!uploadData.momoQRCodePreviewUrl ? (
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="label"
                    sx={{ display: "flex", flexDirection: "column", p: 4 }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={showPreviewMomo}
                    />
                    <UploadIcon sx={{ fontSize: "100px" }} />
                    <div>Upload your momo QR code image file</div>
                  </IconButton>
                ) : (
                  <>
                    <img
                      src={uploadData.momoQRCodePreviewUrl}
                      alt="uploadImage"
                      style={{ maxWidth: "400px" }}
                    />
                    <Button
                      variant="outlined"
                      color="success"
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                      }}
                      size="small"
                      onClick={handleCancelMomo}
                    >
                      Change
                    </Button>
                  </>
                )}
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box
                component="div"
                sx={{
                  p: 2,
                  mt: 1,
                  border: "2px dashed grey",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {!uploadData.bankQRCodePreviewUrl ? (
                  <IconButton
                    color="success"
                    aria-label="upload picture"
                    component="label"
                    sx={{ display: "flex", flexDirection: "column", p: 4 }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={showPreviewBank}
                    />
                    <UploadIcon sx={{ fontSize: "100px" }} />
                    <div>Upload your bank QR code image file</div>
                  </IconButton>
                ) : (
                  <>
                    <img
                      src={uploadData.bankQRCodePreviewUrl}
                      alt="uploadImage"
                      style={{ maxWidth: "400px" }}
                    />
                    <Button
                      variant="outlined"
                      color="success"
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                      }}
                      size="small"
                      onClick={handleCancelBank}
                    >
                      Change
                    </Button>
                  </>
                )}
              </Box>
            </TabPanel>
            <TabPanel value="3">
              <TextField
                sx={{ width: "100%", mt: "1rem" }}
                type="text"
                id="outlined-error-helper-text"
                label="Your paypal donation link"
                name="paypalDonationLink"
                value={uploadData.paypalDonationLink}
                onChange={(e) =>
                  setUploadData((uploadData) => ({
                    ...uploadData,
                    paypalDonationLink: e.target.value,
                  }))
                }
                size="small"
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </>
  );
}

export default Payments;
