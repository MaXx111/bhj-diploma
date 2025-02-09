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
    let dataUrl

    if (options.method === "GET") {
        getUrl = `${options.url}?`;
        for (let key in options.data) {
            getUrl += `${key}=${options.data[key]}&`;
        };
    } else if (options.method !== "GET") {
        getUrl = options.url;
        formData = new FormData();
        if (options.data) {
            dataUrl = Object.entries(options.data);
            for (const [key, value] of dataUrl) {
                formData.append(key, value);
            }
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