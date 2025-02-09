/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) {
      throw new Error(`Что то не так с этим объектом - ${element}`)
    }
    this.element = element;
    this.lastOptions;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = document.querySelectorAll('.remove-account');
    const removeTransaction = document.querySelectorAll('.transaction__remove');

    removeAccount.forEach((elem) => {
      elem.addEventListener('click', () => {
        this.removeAccount();
      })
    })
    document.addEventListener('click', (event) => {
      const removeItem = event.target.closest('.transaction__remove');
      if(removeItem){
        const removeItemId = removeItem.getAttribute('data-id');
        this.removeTransaction(removeItemId);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions){
      if (confirm("Вы действительно хотите удалить счёт?")) {
        let id = this.lastOptions.account_id;
        Account.remove({id}, (err, response) => {
          if(response && response.success){
            this.clear();
            App.updateWidgets();
            App.updateForms();
          }
        })
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const areYouSure = confirm("Вы действительно хотите удалить транзакцию?");
    if (areYouSure) {
      Transaction.remove({id}, (err, response) => {
        console.log(response)
        if(response && response.success){
          App.update();
        }
      })
    }

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options) {
      this.lastOptions = options;
      Account.get(`${options.account_id}`, (err, response) => {
        if(response && response.success){
          this.renderTitle(response.data.name);
        }
      })

      Transaction.list(options, (err, response) => {
        if(response && response.success){
          this.renderTransactions(response.data);
        }
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    const empty = [];
    this.renderTitle('Название счёта');
    this.renderTransactions(empty);
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const contentTitle = this.element.querySelector('.content-title');
    contentTitle.textContent = name;

  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const dateSplit = date.split('T');
    const splitDayYearMounth = dateSplit[0].split('-');
    let dateMounth = splitDayYearMounth[1];
    let dateYear = splitDayYearMounth[0];
    let dateDay = splitDayYearMounth[2];
    let dateTime = dateSplit[1].split(':');

    if(dateMounth == 12) {
      dateMounth = 'декабря'
    }

    if(dateMounth == 11) {
      dateMounth = 'ноября'
    }

    if(dateMounth == 10) {
      dateMounth = 'октября'
    }

    if(dateMounth == 9) {
      dateMounth = 'сентября'
    }

    if(dateMounth == 8) {
      dateMounth = 'августа'
    }

    if(dateMounth == 7) {
      dateMounth = 'июля'
    }

    if(dateMounth == 6) {
      dateMounth = 'июня'
    }

    if(dateMounth == 5) {
      dateMounth = 'мая'
    }

    if(dateMounth == 4) {
      dateMounth = 'апреля'
    }

    if(dateMounth == 3) {
      dateMounth = 'марта'
    }

    if(dateMounth == 2) {
      dateMounth = 'февраля'
    }

    if(dateMounth == 1) {
      dateMounth = 'января'
    }

    return `${dateDay} ${dateMounth} ${dateYear} г. в ${dateTime[0]}:${dateTime[1]}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`

  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const contentPanelForTransactions = document.querySelector('.content');
    let html = "";
    for (let i = 0; i < data.length; i++) {
      html += this.getTransactionHTML(data[i]);
    }
    contentPanelForTransactions.innerHTML = html;
  }
}