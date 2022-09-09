import moment from "moment";
import React from "react";

function NotificationItem({ read, imageUrl, content, time }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginTop: "1rem",
        background: read === false ? "rgb(0 0 255 / 4%)" : "white"
      }}
    >
      <img
        alt=""
        src={imageUrl}
        style={{ width: "60px", objectFit: "cover" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "10px 0",
        }}
      >
        <div>{content}</div>
        <div style={{ fontSize: "13px" }}>{moment(time).format('L LT')}</div>
      </div>
    </div>
  );
}

export default NotificationItem;
