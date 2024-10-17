import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Grid } from "@mui/material";
import moment from 'moment';

function Footer() {
  return (
    <Grid mt={2}>
      <Typography
        variant="body2"
        color="#ffff"
        align="center"
        bgcolor={"#000000"}
      >
        {"Copyright © "}
        <Link color="#ffff" href="https://#">
          SIGECEE
        </Link>{" "}
        {moment().year()}
        {"."}
      </Typography>
    </Grid>
  );
}

export default Footer;
