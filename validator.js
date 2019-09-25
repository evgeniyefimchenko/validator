/* validator 1.5 23.05.2018 efimchenko.ru*/

/* Зависимости Font Awesome 4.7.0, bootstrap4, jQuery 3;
 * Плагин проверки полей ввода на валидность.
 * Так же предлагает сгенерировать пароль в случае его ненадёжности.
 * Выводит оценку надёжности в виде звёзд.
 */
(function ($) {
    $.fn.validator = function () {
        var standart_text = 'Неверный формат ';
       
        /**
         * Паттерны для проверки полей формы
         * @type RegExp
         */        
        var pattern_email = /^([a-zа-яё0-9_\.-])+@[a-zа-яё0-9-]+\.([a-zа-яё]{2,4}\.)?[a-zа-яё]{2,4}$/i; // электронная почта, латинские и кириллические символы
        var pattern_string = /^[a-zа-яё\.\!\? ]+$/i; // Строка, латинские и кириллические символы, точка, знак вопроса и восклицания
        var pattern_digital = /^\d+$/; // Цифры
        var pattern_phone_ru = /^[\d+][\d\(\)\ -]{4,14}\d$/; // Номер телефона, международный формат
        var pattern_password = /[a-z\d+\!\@\#\$\%\^\&\*\(\)\_\-\+\=\\\|\/\.\,\:\;\[\]\{\}]+/i; // Пароль            
        var pattern_year = /^\d{4}$/; // Год
        var pattern_vendor_code = /^[a-яёa-z\d-\/\(\)\№\" \,\.]+$/i; // Код производителя
        var pattern_adress = /^[a-яё\d\.,\(\)\/ ]+$/i; // Почтовый адрес
        var pattern_zipcode = /^\d{6}$/; // Почтовый индекс
        var pattern_account = /^\d{20}$/; // Банковский счёт
        var pattern_inn = /^\d{10,12}$/; // ИНН
        var pattern_kpp = /^\d{9}$/; // КПП
        var pattern_okpo = /^\d{8,10}$/; // ОКПО
        var pattern_ogrn = /^\d{13}$/; // ОГРН
        var pattern_bik = /^\d{9}$/; // БИК
        var ip_or_url = /^[a-z0-9\.\-\_]+$/i; // IPv4, IPv6 или доменное имя
        var unix_path = /^\/$|(^(?=\/)|^\.|^\.\.)(\/(?=[^/\0])[^/\0]+)*\/?$/;
        var url_path_file = /^((http[s]?):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
        var win_path = /[a-zA-Z]:[\\\/](?:[a-zA-Z0-9]+[\\\/])*([a-zA-Z0-9]+)/;
        /**
		* Новые паттерны пока не обрабатываются
		*/
		var creditCard = '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35d{3})d{11})$';
		var username = '/^[a-z0-9_-]{3,16}$/';		
		var dateDDMMYYY = '^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)dd$';  // Дата в формате DD/MM/YYYY
		/**
         * Генерирует случайный пароль
         * @param {int} length количество символов в пароле
         * @returns {String} сгенерированный пароль
         */
        function randomPassword(length) {
            var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
            var pass = "";
            for (var x = 0; x < length; x++) {
                var i = Math.floor(Math.random() * chars.length);
                pass += chars.charAt(i);
            }
            return pass;
        }

        function checkPassword(password) { // Сложность пароля
            var s_letters = "qwertyuiopasdfghjklzxcvbnm"; // Буквы в нижнем регистре
            var b_letters = "QWERTYUIOPLKJHGFDSAZXCVBNM"; // Буквы в верхнем регистре
            var digits = "0123456789"; // Цифры
            var specials = "!@#$%^&*()_-+=\|/.,:;[]{}"; // Спецсимволы
            var is_s = false; // Есть ли в пароле буквы в нижнем регистре
            var is_b = false; // Есть ли в пароле буквы в верхнем регистре
            var is_d = false; // Есть ли в пароле цифры
            var is_sp = false; // Есть ли в пароле спецсимволы
            for (var i = 0; i < password.length; i++) {
                /* Проверяем каждый символ пароля на принадлежность к тому или иному типу */
                if (!is_s && s_letters.indexOf(password[i]) !== -1)
                    is_s = true;
                else if (!is_b && b_letters.indexOf(password[i]) !== -1)
                    is_b = true;
                else if (!is_d && digits.indexOf(password[i]) !== -1)
                    is_d = true;
                else if (!is_sp && specials.indexOf(password[i]) !== -1)
                    is_sp = true;
            }
            var rating = 0;
            var text = "";
            if (is_s)
                rating++; // Если в пароле есть символы в нижнем регистре, то увеличиваем рейтинг сложности
            if (is_b)
                rating++; // Если в пароле есть символы в верхнем регистре, то увеличиваем рейтинг сложности
            if (is_d)
                rating++; // Если в пароле есть цифры, то увеличиваем рейтинг сложности
            if (is_sp)
                rating++; // Если в пароле есть спецсимволы, то увеличиваем рейтинг сложности
            /* Далее идёт анализ длины пароля и полученного рейтинга, и на основании этого готовится текстовое описание сложности пароля */
            if (password.length < 6 && rating < 3)
                text = "*";
            else if (password.length < 6 && rating >= 3)
                text = "***";
            else if (password.length >= 8 && rating < 3)
                text = "**";
            else if (password.length >= 8 && rating >= 3)
                text = "*****";
            else if (password.length >= 6 && rating === 1)
                text = "*";
            else if (password.length >= 6 && rating > 1 && rating < 4)
                text = "****";
            else if (password.length >= 6 && rating === 4)
                text = "*****";
            return text;
        }
        ;
        /*Добавляем бэйджи для вывода ошибок*/
		this.after('<span class="badge badge-danger validatorbadgedanger" style="display:none;"></span>');
        /*Добавляем звёзды если есть поля с проверкой сложности пароля и они ещё не созданы*/
        if (!$("span").is(".star-rating")) {
			$('[data-validator  = "password_strength"]').after('<span style="display: none;" class="star-rating" title="Сложность пароля" data-toggle="tooltip"><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i></span>');
		}
        /*Если есть параметр password_strength создаёт кнопку генерации пароля, если ещё не создана*/
		if (!$("button").is("#validatorgenpass")) {
			$('[data-validator  = "password_strength"]').after('<button type="button" id="validatorgenpass" class="btn btn-info btn-sm" style="display:none;">Сгенерировать?</button>');
		}
        /*При нажатии генерировать пароль вставлям его в поле ввода, проверяем надёжность и делаем поле текстовым для видимости пароля
         * после выхода с поля в обработке blur обратно меняется тип на password*/
        $('#validatorgenpass').click(function () {
            var p = randomPassword(8);
            var $passw_input = $('[data-validator  = "password_strength"]');
            $passw_input.val(p);
            $passw_input.blur();
            $passw_input.prop('type', 'text');            
        });
        /*Перебираем все подходящие поля для проверки*/
        return this.each(function () {						
            $(this).blur(function () {
				var verify = $(this).data('validator');                
                var required = $(this).prop('required');
                /*Очищаем переменную от начальных и конечных пробелов в INPUT*/
                var this_val = $.trim($(this).val());
                $(this).val(this_val);
                
                if (required && !this_val) {
                    $(this).next(".validatorbadgedanger:first").text('Пустое поле').show();
                    return true;
                } else {
                    $(this).next(".validatorbadgedanger:first").text('').hide();
                }
                
                if (this_val && verify === 'email') {
                   /*Убрали межсимвольные пробелы*/
                    this_val = this_val.replace(/\s/g, '');
                    $(this).val(this_val);
                    if (!pattern_email.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'почты').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'string') {
                    if (!pattern_string.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'строки').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'digital') {
                   /*Убрали межсимвольные пробелы*/
                    this_val = this_val.replace(/\s/g, '');                    
                    if (!pattern_digital.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'числа').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'phone') {
                    /*Убрали межсимвольные пробелы*/
                    this_val = this_val.replace(/\s/g, '');
                    $(this).val(this_val);
                    if (!pattern_phone_ru.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'телефона').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'year') {
                    if (!pattern_year.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'года').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }   
                
                if (this_val && verify === 'vendor_code') {
                    var test_text = this_val ? this_val : $(this).text();
                    if (!pattern_vendor_code.test(test_text)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'ввода').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'adress') {
                    if (!pattern_adress.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'адреса').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                } 
                
                if (this_val && verify === 'zipcode') {
                    if (!pattern_zipcode.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'индекса').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'account') {
                    if (!pattern_account.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'счёта').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'inn') {
                    if (!pattern_inn.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'ИНН').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'kpp') {
                    if (!pattern_kpp.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'кода причины постановки на учет').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                } 
                
                if (this_val && verify === 'okpo') {
                    if (!pattern_okpo.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'общероссийского классификатора предприятий и организаций').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'ogrn') {
                    if (!pattern_ogrn.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'основного государственного регистрационного номера').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }       
                
                if (this_val && verify === 'bik') {
                    if (!pattern_bik.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'банковского идентификационного кода').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }  
                
                if (this_val && verify === 'password' || this_val && verify === 'password_strength') {
                    if (!pattern_password.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'пароля').show();
                    } else {
                        if (this_val && verify === 'password_strength') {
                            $(this).prop('type', 'password');
                            $('#validatorgenpass').css('display', 'none');
                            var stars = checkPassword(this_val);
                            var i = stars.length;
                            var l = 1;
                            $('.star-rating').children().each(function(){
                                if(i>=l){$('.star-rating').show(); $(this).removeClass('fa-star-o').addClass('fa-star');}
                                else {$(this).removeClass('fa-star').addClass('fa-star-o');}
                                l++;
                            });                            
                              
                            if (stars === '*') {
                                $(this).next(".validatorbadgedanger:first").text('Слишком простой пароль').show();
                                $('#validatorgenpass').css('display', '');
                            } else {
                                $(this).next(".validatorbadgedanger:first").text('').hide();
                            }
                        } else {
                            $(this).next(".validatorbadgedanger:first").text('').hide();
                        }
                    }
                }
                
                if (this_val && verify === 'confirm_password') {
                    var var1 = $(this).closest('form').find('[data-validator = "password"]').val();
                    var var2 = $(this).closest('form').find('[data-validator = "password_strength"]').val();
                    var $pass = var1 ? var1 : var2;
                    if (this_val !== $pass) {
                        $(this).next(".validatorbadgedanger:first").text('Пароли не совпадают.').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'address_server') {
                    /*Убрать межсимвольные пробелы*/
                    this_val = this_val.replace(/\s/g, '');
                    $(this).val(this_val);                    
                    if (!ip_or_url.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'неверный адрес').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'unix_path') {                  
                    if (!unix_path.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'неверный unix путь').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'url_path') {
                    /*Убрать межсимвольные пробелы*/
                    this_val = this_val.replace(/\s/g, '');
                    $(this).val(this_val);                    
                    if (!url_path_file.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'неверный url путь').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
                
                if (this_val && verify === 'win_path') {                                        
                    if (!win_path.test(this_val)) {
                        $(this).next(".validatorbadgedanger:first").text(standart_text + 'неверный путь к файлу').show();
                    } else {
                        $(this).next(".validatorbadgedanger:first").text('').hide();
                    }
                }
            });
			if ($(this).data('validator') == 'password_strength') {
				$(this).keyup(function() {
					$(this).blur().focus();				
				});				
			}
        });			
    };
})(jQuery);