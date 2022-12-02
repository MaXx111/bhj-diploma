/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.element = element;
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsList = this.element.querySelector('.accounts-select');

    if(User.current()) {
      Account.list(User.current(), (err, response) => {
        if(response && response.success) {
          console.log(response)
          let html = "";
          for (let i = 0; i < response.data.length; i++) {
            html += `<option value="${response.data[i].id}">${response.data[i].name}</option>`;
          }
          accountsList.innerHTML = html;
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {  

    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        App.update();
        App.getModal('newExpense').close();
        App.getModal('newIncome').close();
      }
    });


  }
}