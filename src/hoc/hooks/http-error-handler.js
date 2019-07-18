import { useState, useEffect } from 'react';

export default httpClient => { //to axios
    const [error, setError] = useState(null);

        //componentWillMount jest teraz nie potrzebny bo to się samo po prostu najpierw wykona
        const reqInterceptor = httpClient.interceptors.request.use(req => {
            setError(null);
            return req; //niech idzie dalej
        });
        const respInterceptor = httpClient.interceptors.response.use(res => res, err => {
            setError(err);
        });

        useEffect(() => {
            return () => {
                httpClient.interceptors.request.eject(reqInterceptor);
                if(httpClient.interceptors.respond) httpClient.interceptors.respond.eject(respInterceptor);
            };
        }, [reqInterceptor, respInterceptor]);

        const errorConfirmedHandler = () => {
            setError(null);
        }

        return [error, errorConfirmedHandler];
}