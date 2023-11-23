import axios from 'axios';

const melhorEnvioInstance = axios.create({
  baseURL: 'https://melhorenvio.com.br',
});
export default melhorEnvioInstance;
