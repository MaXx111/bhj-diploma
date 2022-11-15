/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = "/user";
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) { 
    localStorage.user = JSON.stringify(user);
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() { 
    delete localStorage.user;

  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {  
    if(!localStorage.user) {
      return undefined;
    } else {
      return JSON.parse(localStorage.user);
    }

  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {  
    createRequest({
      url: `${this.URL}/current`,
      method: "GET",
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response,user);
        } else {
          console.log(err)
          this.unsetCurrent();
        }
        callback(err, response);
      }
    })

  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) { 
    createRequest({
      url: `${this.URL}/register`,
      method: "POST",
      data,
      callback: (err, response) => {
        if(response && response.user) {
          this.setCurrent(response.user);
        } else {
          console.log(err);
        }
        callback(err, callback);
      }
    })
  }

  // const data = {
  //   name: 'Vlad',
  //   email: 'test@test.ru',
  //   password: 'abracadabra'
  // }

  // User.register( data, ( err, response ) => {
  //   console.log( response.success );
  //   console.log( err )
  // });

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: `${this.URL}/logout`,
      method: "POST",
      callback: (err, response) => {
        if (response.success === "true") {
          this.unsetCurrent();
        }
      }
    })
  }
}

// User.logout((err, response) => {
//  console.log(response);
// });