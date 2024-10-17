import * as React from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function MainFeaturedPost(props) {
  const { post, executeScroll } = props;

  return (
    <Box sx={{
      flexGrow: 1,
      //mt: 4
    }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container id="back-to-top-anchor">
          <Grid item xs={12} sm={12}>
            <Paper
              sx={{
                position: "relative",
                backgroundColor: "grey.800",
                color: "#fff",
                mb: 1,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: `url(${post.image})`,
                height: '100vh'
              }}
            >
              {/* Increase the priority of the hero background image */}
              {
                <img
                  style={{ display: "none" }}
                  src={post.image}
                  alt={post.imageText}
                />
              }
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  backgroundColor: "rgba(0,0,0,.6)",
                }}
              />
              <Grid container alignItems="center" sx={{ height: '100vh' }}>
                <Grid item xs={12} md={10} lg={7} >
                  <Box
                    sx={{
                      position: "relative",
                      p: { xs: 3, md: 6 },
                      pr: { md: 0 },
                    }}
                  >
                    <Typography
                      component="h1"
                      variant="h3"
                      color="inherit"
                      gutterBottom
                      sx={{ fontFamily: 'Montserrat', }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="h5" color="inherit" paragraph sx={{ fontFamily: 'Montserrat', }}>
                      {post.description}
                    </Typography>
                    <Typography variant="h6" color="inherit" paragraph sx={{ fontFamily: 'Montserrat', mt: 2 }}>
                      {post.description2}
                    </Typography>
                    <Box
                      component="span"
                      sx={{
                        // minWidth: '125px',
                        //display: 'flex',
                        justifyContent: 'left',
                        mt: 2
                      }}
                    >
                      <Button variant="contained" size="large" color="inherit" onClick={executeScroll} sx={{ fontFamily: 'Montserrat', textTransform: "none", color: 'black', fontWeight: 600, mt: 2 }}>
                        Ver publicaciones
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

MainFeaturedPost.propTypes = {
  post: PropTypes.shape({
    image: PropTypes.string.isRequired,
    imageText: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default MainFeaturedPost;
