# validator
Простой jQuery плагин проверки полей ввода на валидность.
Зависимости Font Awesome 4.7.0, bootstrap4, jQuery 3;
***
**Инициализация плагина**
```html
<script>
	if(jQuery().validator) {
		jQuery('[data-validator]').validator();
	}
</script>
```
![Первый скрин](http://efimchenko.ru/images/temp/screen1.png) ![Второй скрин](http://efimchenko.ru/images/temp/screen2.png)

**Использование в HTML**
```html
<div class="form">
    <form id="reg_form" method="post" data-remote="true" accept-charset="UTF-8">
        <div class="form-group">
          <input id="reg_email" class="form-control" autocomplete="off" type="text" placeholder="Почта" name="email" data-validator="email" required="true" value="">
        </div>
        <div class="form-group">
          <input id="reg_password" class="form-control" type="password" autocomplete="off" placeholder="Пароль" name="password" data-validator="password_strength" required="true" value="">
        </div>
        <div class="form-group"><input id="reg_password_confirmation" class="form-control" autocomplete="off" type="password" placeholder="Повторите пароль" name="password_confirmation" data-validator="confirm_password" required="true">
        </div>
        <input class="btn btn-default btn-register" type="submit" value="Создать аккаунт" name="commit">
    </form>
</div>
```
**Описание**

В атрибут data-validator указываем необходимое правило для проверки, список правил приведён ниже.
После каждого поля с data-validator будет добавлен тэг:
```html
<span class="badge badge-danger validatorbadgedanger" style="display: none;"></span>
```
Принимающий описание ошибки ввода.
Если использовать AJAX отправку формы, то удобно делать проверку валидности ввода по видимым элементам с классом validatorbadgedanger

Пример javascript:
```html
<script>
var error = 0;
	$('.validatorbadgedanger').each(function(){
		if ($(this).css('display') !== 'none') {
			error = 1;
		}
	});
</script>
```

***Список правил:***
* email - электронная почта, латинские и кириллические символы
* string - строка, латинские и кириллические символы, точка, знак вопроса и восклицания>
* digital - цифры
* phone - Номер телефона, международный формат
* password - пароль
* password_strength - подключит проверку сложности пароля
* confirm_password - проверит совпадение паролей в двух полях
* year - год
* vendor_code - код производителя
* adress - Почтовый адрес
* zipcode - Почтовый индекс
* account - Банковский счёт
* inn - ИНН
* kpp - КПП
* okpo - ОКПО
* ogrn - ОГРН
* bik - БИК
* address_server - IPv4, IPv6 или доменное имя
* unix_path - UNIX путь к файлу
* url_path_file - URL путь к файлу
* win_path - WINDOWS путь к файлу


Copyright <http://efimchenko.ru> 2018 under the MIT license.
