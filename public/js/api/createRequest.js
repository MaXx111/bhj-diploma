/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
// const createRequest = (options = {}) => {

// };
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let formData;
    let getUrl;

    if (options.method === "GET") {
        if (!options.data) {
            getUrl = options.url
        } else {
            getUrl = "?";
            for (let key in options.data) {
                getUrl += `${key}=${options.data[key]}&`;
            };
        }
    } else if (options.method !== "GET") {
        getUrl =options.url;
        let dataUrl = Object.entries(options.data);
        formData = new FormData();
        for (const [key, value] of dataUrl) {
            formData.append(key, value);
        }
    }

    try { 
        xhr.open(options.method, getUrl);
        xhr.send(formData);
    } catch (err){
        options.callback(err, null);
    }

    xhr.onload = () => {
            options.callback(null, xhr.response);
    }
};