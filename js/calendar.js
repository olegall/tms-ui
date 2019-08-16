    const daysInWeek = 7;
    const days = {
        mon: 0,
        sun: 6
    };
    const monthsNumber = {
        jan: 0,
        oct: 9,
        nov: 10,
        dec: 11
    };
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let months = ['Январь', 'Февраль', 'Март', 'Апрель',
                'Май', 'Июнь', 'Июль', 'Август',
                'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    $('.calendar').on('dblclick',function () {
        if($(this).prev().length == 0) 
            $('<p class="for"style="display:none;"></p>').insertBefore(this);
        if($(this).prev() != undefined && $(this).prev()[0].className != "calendar-wrapper") {
            $('<input type="text" class="hidden-input" hidden value=""/>').insertBefore(this);
            $('<div class="calendar-wrapper"></div>').insertBefore(this);
            let dateInInput = $(this).val().split('.');
            if(dateInInput[0] == '') {
                createCalendar($(this).prev(), year, currentMonth, '', hours, minutes);
            } else if(dateInInput[0] != ''){
                let input = $(this).val().split('.');
                let inputYearAndTime = input[2].split(' ');
                let inputYear = inputYearAndTime[0];
                let HourMinute = inputYearAndTime[1].split(':');
                createCalendar($(this).prev(),inputYear,input[1]-1,input[0],HourMinute[0],HourMinute[1]);
            }
            let coords = $(this).position();
            $($(this).prev()).css({ 'top': coords.top - 280 + "px", 'left': coords.left - 20 + 'px'});    //, 'left': '8%'
        }
    });    

    function createCalendar(calendar, year, month, day, hour, minute) {
        let date = new Date(year, month);
        let table = getTable(year,month);
        //let hours = today.getHours();
        //let minutes = today.getMinutes();
        for (let i = 0; i < getDay(date); i++) table += '<td></td>';

        for (i = 0; date.getMonth() == month; i++) {
            if(date.getDate() != day) {
                table += '<td onclick="chooseDay(this)">' + date.getDate() + '</td>';
            } else if(date.getDate() == day) {
                table += '<td onclick="chooseDay(this)" class="selectedDay">' + date.getDate() + '</td>';
                let copyMonth = month + 1;
                copyMonth = (copyMonth < 10) ? '0' + copyMonth : copyMonth;
                $(calendar).prev().val(`${day}.${copyMonth}.${year}`);
            }
            if (getDay(date) % daysInWeek == days.sun) // вс, последний день - перевод строки
                table += '</tr><tr>';
            date.setDate(date.getDate() + 1);
        }
        if (getDay(date) != days.mon) {
            for (let i = getDay(date); i < daysInWeek; i++) {
                table += createCell();
            }
        }
        table += closeTable();
        $(calendar).html(table);
        $(calendar).append(fieldHours(hour));
        $(calendar).append(fieldMinutes(minute));
        $(calendar).append(SaveTime());
    }

    function chooseDay(e) {
        let yearInCaption = e.parentNode.parentNode.parentNode.parentNode.children[0].caption.innerText.split(/\n/)[1].split(' ')[1];// год из caption table
        let monthInCaption = e.parentNode.parentNode.parentNode.parentNode.children[0].caption.innerText.split(/\n/)[1].split(' ')[0];// месяц из caption table
        let currentDay = e.innerText;
        let hiddenInput = $(e.parentNode.parentNode.parentNode.parentNode).prev();
        let table = [];
        for (let i = 1; i < e.parentNode.parentNode.children.length; i++) {
            table.push(e.parentNode.parentNode.children[i]);
        }

        for (let i = 0; i < table.length; i++) {
            for (let j = 0; j < table[i].children.length; j++) {
                if (table[i].children[j].className == 'selectedDay') {
                    $(table[i].children[j]).removeClass('selectedDay');
                    $(hiddenInput).val('');
                }
            }
        }


        for(let i = 0; i < months.length; i++) {
            if(months[i] == monthInCaption) {
                monthInCaption = i + 1;
            }
        }
            
        currentDay = (currentDay < 10) ? '0' + currentDay : currentDay;
        monthInCaption = (monthInCaption < 10) ? '0' + monthInCaption : monthInCaption;
        if (!$(e).hasClass('selectedDay') && $(hiddenInput).val() == '') {
            $(e).addClass('selectedDay');
            $(hiddenInput).val(`${currentDay}.${monthInCaption}.${yearInCaption}`);
            //console.log("на добавлении " +  $(hiddenInput).val());
        } 
    }

    function saveDate(e) {
        let hour = e.parentNode.children[2].value;
        let minute = e.parentNode.children[4].value;
        if (!(hour.match(/0[0-9]/)))
            hour = (hour < 10) ? '0' + hour : hour;
        if (!(minute.match(/0[0-9]/)))
            minute = (minute < 10) ? '0' + minute : minute;
        let currentValueInput = $(e.parentNode).next();
        let hiddenInput = $(e.parentNode).prev().val();
        if(hiddenInput != '')
            $(currentValueInput).val(`${hiddenInput} ${hour}:${minute}`);
        $(e.parentNode).remove();
    }

    function nextMonth(e) {
        $(e.parentNode.parentNode.parentNode).prev().val('');
        let calendarWrapper = e.parentNode.parentNode.parentNode;
        let hour = ($(calendarWrapper).next()[0].value != '')? $(calendarWrapper).next()[0].value.split(' ')[1].split(':')[0] : today.getHours();
        let minute = ($(calendarWrapper).next()[0].value != '')? $(calendarWrapper).next()[0].value.split(' ')[1].split(':')[1] : today.getMinutes();
            $(calendarWrapper).empty();
            if (currentMonth >= 0 && currentMonth <= 11) {
                currentMonth++;
                if (currentMonth != 12) 
                    createCalendar(calendarWrapper, currentYear, currentMonth,'',hour,minute);
            }
            if (currentMonth == -1 || currentMonth == 0) {
                currentMonth = 11;
                createCalendar(calendarWrapper, currentYear, currentMonth,'',hour,minute);
            }
            if (currentMonth == 12) {
                currentMonth = 0;
                currentYear++;
                createCalendar(calendarWrapper, currentYear, currentMonth,'',hour,minute);
            }
        }

    function previousMonth(e) {
        $(e.parentNode.parentNode.parentNode).prev().val('');
        let calendarWrapper = e.parentNode.parentNode.parentNode;
        let hour = ($(calendarWrapper).next()[0].value != '')? $(calendarWrapper).next()[0].value.split(' ')[1].split(':')[0] : today.getHours();
        let minute = ($(calendarWrapper).next()[0].value != '')? $(calendarWrapper).next()[0].value.split(' ')[1].split(':')[1] : today.getMinutes();
        $(calendarWrapper).empty();
        if (currentMonth >= 0 && currentMonth <= 11) {
            currentMonth--;
            if (currentMonth != -1)
                createCalendar(calendarWrapper, currentYear, currentMonth, '', hour, minute);
        }
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
            createCalendar(calendarWrapper, currentYear, currentMonth, '', hour, minute);
        }
    }

    function getTable(year,month) {
        return '<table>' +
                    '<caption>' +
                        '<span class="previousMonth" onclick=previousMonth(this)> < </span>' +
                        '<span class="calendar-wrapper-date">' + months[month] + ' ' + year + '</span>' +
                        '<span class="nextMonth" onclick=nextMonth(this)>></span>' +
                    '</caption>' +
                    '<tr>' +
                        '<th>пн</th>' +
                        '<th>вт</th>' +
                        '<th>ср</th>' +
                        '<th>чт</th>' +
                        '<th>пт</th>' +
                        '<th>сб</th>' +
                        '<th>вс</th>' +
                    '</tr>' +
                    '<tr>';
    }

    function getDay(date) {
        let day = date.getDay();
        if (day == 0) day = 7;
        return day - 1;
    }

    let closeTable = () => '</tr></table>';

    let createCell = () => '<td></td>';

    let fieldHours = (hour) =>  `<span>Час</span><input type = "number" min="0" max="23" class = "time hours" placeholder = "Час" value = ${hour} />`;
    let fieldMinutes = (minute) =>  `<span>Мин</span><input type = "number" min="0" max="60" class = "time minutes" placeholder = "Мин" value = ${minute} />`;
    let SaveTime = () => '<button class="ok" onclick=saveDate(this)>OK</button>';