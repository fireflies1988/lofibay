import { Container } from "@mui/system";
import React from "react";

function Collection() {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "1200px" }}>
        <div style={{ display: "flex", gap: "3px" }}>
          <img
            alt=""
            src="https://res.cloudinary.com/dsskvx9ha/image/upload/v1637344108/Lofibay/photos/jy0rzol8j5fbp801ffhh.jpg"
            style={{
              width: "253px",
              height: "253px",
              objectFit: "cover",
              borderRadius: "1rem 0 0 1rem",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <img
              alt=""
              src="https://res.cloudinary.com/dsskvx9ha/image/upload/v1637780080/Lofibay/photos/g2trrovnubk8lkhe9aog.jpg"
              style={{
                width: "100px",
                height: "125px",
                objectFit: "cover",
                borderRadius: "0 1rem 0 0",
              }}
            />
            <img
              alt=""
              src="https://res.cloudinary.com/dsskvx9ha/image/upload/v1637513733/Lofibay/photos/af0pvzjxf7avu2apu0zg.jpg"
              style={{
                width: "100px",
                height: "125px",
                objectFit: "cover",
                borderRadius: "0 0 1rem 0",
              }}
            />
          </div>
        </div>

        <h3>Green</h3>
      </div>
    </>
  );
}

export default Collection;
