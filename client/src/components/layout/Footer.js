import {
  Grid,
  Paper,
  Avatar,
  Typography,
  Link,
  Divider
} from "@mui/material";
import UCV from '../../assets/images/UCV.png';
import moment from 'moment';

export default function Footer() {
  return (
    <Grid item xs={12} sx={{ display: 'flex' }}>
      <Paper sx={{
        marginTop: 'calc(10% + 50px)',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: '#000',
        opacity: '75%',
      }} component="footer" square variant="outlined">
        <Grid container sx={{
          p: 0.2,
        }} justifyContent='center' alignItems="center" >{/* */}
          <Grid item>
            <Avatar src={UCV} sx={{ width: 28, height: 28 }} />
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: '#fff', mx: 2 }} />
          <Grid item>
            <Link href="http://www.ucv.ve/" target="_blank" sx={{
              color: '#fff', textDecoration: 'none', ":hover": {
                textDecoration: 'underline'
              }
            }}>
              <Typography variant="caption" color="#fff">Universidad Central de Venezuela</Typography>
            </Link>
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: '#fff', mx: 2 }} />
          <Grid item>
            <Link href="http://www.ciens.ucv.ve/ciens/" target="_blank" sx={{
              color: '#fff', textDecoration: 'none', ":hover": {
                textDecoration: 'underline'
              }
            }}>
              <Typography variant="caption" color="#fff">Facultad de Ciencias</Typography>
            </Link>
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: '#fff', mx: 2 }} />
          <Grid item>
            <Typography variant="caption" color="#fff">Escuela de Computación</Typography>
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: '#fff', mx: 2 }} />
          <Grid item>
            <Typography variant="caption" color="#fff">{"© "}SIGECEE</Typography>
          </Grid>
          <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: '#fff', mx: 2 }} />
          <Grid item>
            <Typography variant="caption" color="#fff">{moment().year()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}