import React, { useRef, useState, useEffect } from 'react';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";

// STYLES
const styles = {
  details: {
    padding: "1rem",
    borderTop: "1px solid #e1e1e1"
  },
  value: {
    padding: "1rem 2rem",
    borderTop: "1px solid #e1e1e1",
    color: "#899499"
  },
  hiddenInput: {
    display: 'none',
  },
};

//APP
export default function ProfileCard(props: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(props.img);

  useEffect(() => {
    if (props.Avatar) {
      // Create a URL for the file
      const url = URL.createObjectURL(props.Avatar);
      setAvatarUrl(url);

      // Clean up the URL object when the component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAvatarUrl(props.img);
    }
  }, [props.Avatar, props.img]);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      // Handle file upload or preview logic here
      console.log('Selected file:', file);
      props.setAvatar(file);
    }
  };

  return (
    <Card variant="outlined">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* CARD HEADER START */}
        <Grid item sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
          {/* PROFILE PHOTO */}
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <PhotoCameraIcon
                sx={{
                  border: "5px solid white",
                  backgroundColor: "#ff558f",
                  borderRadius: "50%",
                  padding: ".2rem",
                  width: 35,
                  height: 35,
                  cursor: 'pointer',
                }}
                onClick={handlePhotoClick}
              ></PhotoCameraIcon>
            }
          >
            <Avatar
              sx={{ width: 100, height: 100, mb: 1.5 }}
              src={avatarUrl}
            ></Avatar>
          </Badge>

          {/* DESCRIPTION */}
          <Typography variant="h6">{props.name}</Typography>
          <Typography color="text.secondary">{props.role}</Typography>
        </Grid>
        {/* CARD HEADER END */}

        {/* DETAILS */}
        <Grid container>
          <Grid item xs={6}>
            <Typography style={styles.details}>Department</Typography>
            {/* <Typography style={styles.details}>Detail 2</Typography>
            <Typography style={styles.details}>Detail 3</Typography> */}
          </Grid>
          {/* VALUES */}
          <Grid item xs={6} sx={{ textAlign: "end" }}>
            <Typography style={styles.value}>{props.department}</Typography>
            {/* <Typography style={styles.value}>{props.dt2}</Typography>
            <Typography style={styles.value}>{props.dt3}</Typography> */}
          </Grid>
        </Grid>

        {/* BUTTON */}
        {/* <Grid item style={styles.details} sx={{ width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "99%", p: 1, my: 2 }}
          >
            View Public Profile
          </Button>
        </Grid> */}
      </Grid>

      {/* File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={styles.hiddenInput}
      />
    </Card>
  );
}
