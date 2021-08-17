import axios from 'axios';
export const postImage = async (img) => {
  const config = {
    headers: {
      Accept: '*/*',
    },
  };
  const body = {
    imageData: img,
  };
  const res = await axios.post('http://localhost:5000/postimage', config, body);
  console.log('response:', res.data);
};
