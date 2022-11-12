/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
// const createRequest = (options = {}) => {

// };
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let err;
    try { 
        if(options.method !== "GET") {
            let dataUrl = Object.entries(options.data);
            let formData = new FormData();
            for (const [key, value] of dataUrl) {
                formData.append(key, value);
            }
            xhr.open( options.method, options.url);
            xhr.send(formData);
        }

        if (options.method === "GET") {
            let getData = options.data;
            let getUrl = `${options.url}?mail=${getData.email}&password=${getData.password}`;
            xhr.open(options.method, getUrl);
            xhr.send();
        }
    } catch (error){
        err =  'Ошибка ' + error.name + ":" + error.message + "\n" + error.stack;
    }

    xhr.onload = () => {
        if (err) {
            options.callback(err, null);
        } else {
            options.callback(null, xhr.response);
        }
    }
};




// const createRequest = (options = {}) => {
//     const xhr = new XMLHttpRequest();
//     console.log(options);
//     xhr.responseType = "json"
//     let url;
//     let method;
//     let data;
//     if (options.method) {
//         data = Object.entries(options.data);
//         method = options.method;
//         url = options.url;
//         if (method === 'GET') {
//             for ([key, value] of data) {
//                 url += key + '=' + value + '&';
//                 console.log(url += key + '=' + value + '&');
//             }
//             xhr.open(method, url);
//             xhr.send();
//         }
//         if (method !== 'GET') {
//             formData = new FormData();
//             for ([key, value] of data) {
//                 formData.append(key, value);
//             }
//             xhr.open(method, url);
//             xhr.send(formData);
//         }
//     }   
// }



