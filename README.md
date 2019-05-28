# validator
Простой jQuery плагин проверки полей ввода на валидность.

Зависимости Font Awesome 4.7.0, bootstrap4, jQuery 3;

<hr/>
Использование.<br/>
Инициализация плагина:<br/>
<script>
	if(jQuery().validator) {
		$('[data-validator]').validator();
	}
</script>
  Использование в HTML:
<html>
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
</html>
