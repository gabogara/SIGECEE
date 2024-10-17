import * as React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "./Header";
import MainFeaturedPost from "./MainFeaturedPost";
import Footer from "../layout/Footer3";
import Home from "./post/pages/Home";
import portada from "../../assets/images/mural3.jpg"
import { Box } from "@mui/material";

const mainFeaturedPost = {
  title: 'Bienvenidos a SIGECEE',
  description:
    "El Sistema para la Gestión de Censos, Encuestas y Estudios está dirigido a la comunidad de la Facultad de Ciencias de la Universidad Central de Venezuela.",

  /*| Descubre el panorama completo: Conoce los resultados de censos y encuestas publicados desde SIGECEE.*/
  description2: 'Descubre el panorama completo: Conoce los resultados de censos y encuestas publicados desde SIGECEE en el siguiente botón: ',
  image: portada,
  imageText: "main image description",
};

export default function Blog() {

  const myRefAbout = React.useRef(null);
  const myRefFunc = React.useRef(null);
  const myRefPosts = React.useRef(null);
  const myRefCredits = React.useRef(null);

  const executeScrollAbout = () => window.scrollTo({
    top: myRefAbout.current.offsetTop - 50,
    behavior: "smooth"
  });
  const executeScrollFunc = () => window.scrollTo({
    top: myRefFunc.current.offsetTop - 50,
    behavior: "smooth"
  });
  const executeScrollPosts = () => window.scrollTo({
    top: myRefPosts.current.offsetTop - 50,
    behavior: "smooth"
  });
  const executeScrollCredits = () => window.scrollTo({
    top: myRefCredits.current.offsetTop - 50,
    behavior: "smooth"
  });

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header executeScrollAbout={executeScrollAbout} executeScrollFunc={executeScrollFunc} executeScrollPosts={executeScrollPosts} showItems={true} executeScrollCredits={executeScrollCredits} />
      <Box >
        <Grid container fluid sx={{ width: '100%' }}>
          <MainFeaturedPost post={mainFeaturedPost} executeScroll={executeScrollPosts} />
        </Grid>
      </Box>
      <Container>
        <Home myRefAbout={myRefAbout} myRefFunc={myRefFunc} myRefPosts={myRefPosts} myRefCredits={myRefCredits} />
      </Container>
      <Footer />
    </Box>
  );
}
