import { TabContext, TabPanel } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useState } from "react";
import { LinkStyles } from "./styles/Link.styled";

function DonationDialog({
  open,
  onClose,
  momoQRCode,
  bankQRCode,
  paypalDonationLink,
}) {
  const [donationOption, setDonationOption] = useState("1");

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Donation options</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            textAlign: "center",
          }}
        >
          <TabContext value={donationOption}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "#e6cfcf",
              }}
            >
              <Tabs
                value={donationOption}
                onChange={(e, newValue) => setDonationOption(newValue)}
                aria-label="lab API tabs example"
                textColor="secondary"
                indicatorColor="secondary"
              >
                {momoQRCode && (
                  <Tab
                    label="Momo"
                    value="1"
                    iconPosition="start"
                    sx={{ textTransform: "none" }}
                  />
                )}
                {bankQRCode && (
                  <Tab
                    label="Bank"
                    value="2"
                    iconPosition="start"
                    sx={{ textTransform: "none" }}
                  />
                )}
                {paypalDonationLink && (
                  <Tab
                    label="Paypal"
                    value="3"
                    iconPosition="start"
                    sx={{ textTransform: "none" }}
                  />
                )}
              </Tabs>
            </Box>
            <TabPanel value="1">
              <img
                src={momoQRCode}
                alt="uploadImage"
                style={{ maxWidth: "400px" }}
              />
            </TabPanel>
            <TabPanel value="2">
              <img
                src={bankQRCode}
                alt="uploadImage"
                style={{ maxWidth: "400px" }}
              />
            </TabPanel>
            <TabPanel value="3">
              <LinkStyles target="_blank" href={paypalDonationLink}>
                Paypal donation link
              </LinkStyles>
            </TabPanel>
          </TabContext>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default DonationDialog;
