import React from 'react';
import './styles.css';
import moment from 'moment';
import 'moment/locale/es';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";


const ListItem = ({
  item: { coverSrc, title, date, url, descripcion, bagde },
}) => {
  const navigate = useNavigate();
  const handleClick = (url) => {

    navigate(url)
    console.log(url)
  }
  return (<div className='listItem-wrap' onClick={() => handleClick(url)}>
    <img src={coverSrc} alt='' />
    <header>
      <p>
        <Typography component="h2" variant="h6">
          {title}</Typography>
        {moment(date).format('DD MMM YYYY')}
      </p>
      <span>{bagde}</span>
    </header>
    <footer>
      <p>
        <br></br>
        <Typography variant="subtitle2" paragraph>
          {descripcion}
        </Typography>
        <br></br>
        {/* <Typography variant="subtitle2" color="primary">
          <a href={url} target="_blank" rel="noopener noreferrer" >Leer más...</a>
        </Typography> */}

      </p>
    </footer>
  </div>)
}



export default ListItem;
