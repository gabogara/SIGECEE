import axios from 'axios'

const Api = axios.create({
  //baseURL: 'http://localhost:5000/',
  baseURL: 'http://sigecee.ciens.ucv.ve/',
  //baseURL: "https://sigecee.herokuapp.com/",
})

export default Api