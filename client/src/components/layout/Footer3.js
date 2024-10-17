import {
  Grid,
  Paper,
  Typography,
  Link,
  Divider,
  Box,
} from "@mui/material";
import UCV from '../../assets/images/UCV.png';
import Logo from "../../assets/images/sigecee_white.png";
import moment from 'moment';
//import Ciencias from '../../assets/images/ciens.png';

export default function Footer2() {
  return (
    <Grid item xs={12} sx={{ display: 'flex' }}>
      <Paper sx={{
        marginTop: 'auto',
        width: '100%',
        bottom: 0,
        backgroundColor: '#000',
        opacity: '100%',
        justifyContent: 'space-between',
        px: 7
      }} component="footer" square variant="outlined">
        <Grid container sx={{
          py: 2, px: 7
        }} justifyContent='space-between' alignItems="center" >{/* */}

          <Grid item sx={{
            minWidth: {
              lg: '200px',
              xs: '100%'
            },
            textAlign: {
              lg: 'left',
              xs: 'center'
            }
          }}>
            <Grid item>
              <Typography variant="subtitle2" color="#fff" sx={{ fontWeight: 600, fontFamily: 'Montserrat' }}>Enlaces de interés</Typography>
            </Grid>
            <Grid item sx={{ mt: 1 }}>
              <Link href="http://www.ucv.ve/" target="_blank" sx={{
                color: '#fff', textDecoration: 'none', ":hover": {
                  textDecoration: 'underline'
                }
              }}>
                <Typography variant="caption" color="#fff" sx={{ fontFamily: 'Montserrat' }}>Universidad Central de Venezuela</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link href="http://www.ciens.ucv.ve/ciens/" target="_blank" sx={{
                color: '#fff', textDecoration: 'none', ":hover": {
                  textDecoration: 'underline'
                }
              }}>
                <Typography variant="caption" color="#fff" sx={{ fontFamily: 'Montserrat' }}>Facultad de Ciencias</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link href="http://computacion.ciens.ucv.ve/" target="_blank" sx={{
                color: '#fff', textDecoration: 'none', ":hover": {
                  textDecoration: 'underline'
                }
              }}>
                <Typography variant="caption" color="#fff" sx={{ fontFamily: 'Montserrat' }}>Escuela de Computación</Typography>
              </Link>

            </Grid>

          </Grid>
          <Grid item sx={{
            textAlign: 'center', minWidth: {
              lg: 'auto',
              xs: '100%'
            },
            py: {
              lg: 0,
              xs: 2
            }
          }}>
            <Grid container justifyContent='center' alignItems="center" >
              {/* <Box
                component="img"
                sx={{
                  display: "block",
                  height: 75,
                }}
                alt="Ciencias UCV"
                src={ciencias}
              /> */}
              <Box
                component="img"
                sx={{
                  display: "block",
                  height: 90,
                }}
                alt="SIGECEE"
                src={Logo}
              />
              {/*  */}
            </Grid>
            <Grid item sx={{ mt: 1, textAlign: 'center' }} >
              <Typography variant="caption" color="#fff" sx={{ textAlign: 'center', fontFamily: 'Montserrat' }}>{"© " + moment().year()} SIGECEE</Typography>
              <Divider sx={{ p: 0 }} />
              <Typography variant="caption" color="#fff" sx={{ textAlign: 'center', fontFamily: 'Montserrat' }}>Todos los derechos reservados.</Typography>
            </Grid>
          </Grid>
          <Grid item sx={{
            minWidth: {
              lg: '200px',
              xs: '100%'
            },
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center'
          }}>
            <Box
              component="img"
              sx={{
                display: "inline-flex",
                height: 110,
              }}
              alt="UCV"
              src={UCV}
            />
            {/* <Box
              component="img"
              sx={{
                display: "inline-flex",
                height: 75,
              }}
              alt="UCV"
              src={Ciencias}
            /> */}
            {/* <Grid item>

              <Typography variant="caption" color="#fff" sx={{ fontWeight: 600 }}>Ir a...</Typography>
            </Grid>
            <Grid item sx={{ mt: 1 }}>
              <LinkRouter to="/" style={{
                textDecoration: 'none',
              }} >
                <Typography variant="caption" color="#fff" sx={{
                  "&:hover": {
                    textDecoration: "underline #fff"
                  },
                }}>Página principal</Typography>
              </LinkRouter>
            </Grid>
            <Grid item>
              <LinkRouter to="/login" style={{
                textDecoration: 'none',
              }} >
                <Typography variant="caption" color="#fff" sx={{
                  "&:hover": {
                    textDecoration: "underline #fff"
                  },
                }}>Acceder</Typography>
              </LinkRouter>
            </Grid>
            <Grid item>
              <LinkRouter to="/credits" style={{
                textDecoration: 'none',
              }} >
                <Typography variant="caption" color="#fff" sx={{
                  "&:hover": {
                    textDecoration: "underline #fff"
                  },
                }}>Créditos</Typography>
              </LinkRouter>
            </Grid> */}
          </Grid>
        </Grid>
      </Paper >
    </Grid >
  );
}