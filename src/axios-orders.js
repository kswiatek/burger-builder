import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-f0872.firebaseio.com/' //to url backendu z firebase
});

export default instance;