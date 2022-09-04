import {
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
} from "@mui/material";
import React, { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import CheckboxLabel from "./CheckboxLabel";

function SlideshowGallery({ images }) {
  const [settings, setSettings] = useState({
    infinite: true,
    showNav: true,
    showThumbnails: true,
    thumbnailPosition: "bottom",
    showFullscreenButton: true,
    useBrowserFullscreen: true,
    showPlayButton: true,
    isRTL: false,
    showBullets: false,
    showIndex: false,
    disableThumbnailScroll: false,
    disableKeyDown: false,
    slideDuration: 450,
    slideInterval: 3000,
    slideOnThumbnailOver: false,
    startIndex: 0,
  });

  function handleChangeCheckbox(event) {
    const { name, checked } = event.target;
    setSettings((settings) => ({
      ...settings,
      [name]: checked,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setSettings((settings) => ({ ...settings, [name]: value }));
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={9} xl={9}>
          <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
            <ImageGallery
              items={images}
              infinite={settings.infinite}
              showNav={settings.showNav}
              showThumbnails={settings.showThumbnails}
              thumbnailPosition={settings.thumbnailPosition}
              showFullscreenButton={settings.showFullscreenButton}
              useBrowserFullscreen={settings.useBrowserFullscreen}
              showPlayButton={settings.showPlayButton}
              isRTL={settings.isRTL}
              showBullets={settings.showBullets}
              showIndex={settings.showIndex}
              disableThumbnailScroll={settings.disableThumbnailScroll}
              disableKeyDown={settings.disableKeyDown}
              slideDuration={settings.slideDuration}
              slideInterval={settings.slideInterval}
              slideOnThumbnailOver={settings.slideOnThumbnailOver}
              startIndex={settings.startIndex}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3} xl={3}>
          <Paper variant="outlined" sx={{ padding: "0.75rem" }}>
            <div
              style={{
                fontSize: "1.75em",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Settings
            </div>
            <div>
              <b>Slide duration: </b>
              {settings.slideDuration}
            </div>
            <Slider
              name="slideDuration"
              value={settings.slideDuration}
              onChange={handleChange}
              valueLabelDisplay="auto"
              step={50}
              marks
              min={50}
              max={10000}
            />
            <div>
              <b>Slide interval: </b>
              {settings.slideInterval}
            </div>
            <Slider
              name="slideInterval"
              value={settings.slideInterval}
              onChange={handleChange}
              valueLabelDisplay="auto"
              step={50}
              marks
              min={50}
              max={10000}
            />
            <FormControl fullWidth size="small" sx={{ mt: "0.5rem" }}>
              <InputLabel id="demo-simple-select-label">
                Thumbnail position
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={settings.thumbnailPosition}
                name="thumbnailPosition"
                label="Thumbnail position"
                onChange={handleChange}
              >
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="right">Right</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
                <MenuItem value="left">Left</MenuItem>
              </Select>
            </FormControl>
            <CheckboxLabel
              label="Infinite sliding"
              name="infinite"
              checked={settings.infinite}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Show navigation"
              name="showNav"
              checked={settings.showNav}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Show thumbnails"
              name="showThumbnails"
              checked={settings.showThumbnails}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Show fullscreen button"
              name="showFullscreenButton"
              checked={settings.showFullscreenButton}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Use browser fullscreen"
              name="useBrowserFullscreen"
              checked={settings.useBrowserFullscreen}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Show play button"
              name="showPlayButton"
              checked={settings.showPlayButton}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Right to left"
              name="isRTL"
              checked={settings.isRTL}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Show bullets"
              name="showBullets"
              checked={settings.showBullets}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Show index"
              name="showIndex"
              checked={settings.showIndex}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Disable thumbnail scroll"
              name="disableThumbnailScroll"
              checked={settings.disableThumbnailScroll}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Disable key down"
              name="disableKeyDown"
              checked={settings.disableKeyDown}
              onChange={handleChangeCheckbox}
            />
            <CheckboxLabel
              label="Slide on thumbnail over"
              name="slideOnThumbnailOver"
              checked={settings.slideOnThumbnailOver}
              onChange={handleChangeCheckbox}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SlideshowGallery;
