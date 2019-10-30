$(document).ready(function () {
    let host = window.location.href.split("/TMSMVC/")[0];

    $('.update-claim').click(function () {
        let id = $(this).attr('id');
        let number = $(this).parent().find('.number').text();
        let date = $(this).parent().find('.date').text();
        let data = '?id=' + id + '&number=' + number + '&date=' + date;
        window.location.href = host + '/TMSMVC/Claims/Update' + data;
    });

    $('.delete-claim').click(function () {
        let data = '?id=' + $(this).attr('id');
        window.location.href = host + '/TMSMVC/Claims/Delete' + data;
    });

    $('.get-details').click(function () {
        let data = '?id=' + $(this).attr('id');
        window.location.href = host + '/TMSMVC/Claims/Details' + data;
    });

    // Создание задания
    $('.assign-auto').click(function () {
        $.get("ajax/test.html", function (data) {
            
        });
    });

    // Конфигуратор маршрута
    let host1 = window.location.hostname;
    let port = window.location.port;
    //let base_API_URL = "http://" + host1 + ':' + port + "/api/API/";
    let base_API_URL = "http://localhost/TMSMVC/api/API/";
    $('.route').on('click', '.add-route-point', function () {
        $('.route')
            .append(getAddressPart('area', 'область'))
            .append(getAddressPart('city', 'населенный пункт'))
            .append(getAddressPart('street', 'улица'))
            .append(getAddressPart('building', 'дом'))
            .append(getAddRemoveButtons());
    });

    $('.route').on('click', '.remove-point', function () {
        $(this).prev().slideUp(function () { $(this).remove(); });
        $(this).prev().prev().slideUp(function () { $(this).remove(); });
        $(this).prev().prev().prev().slideUp(function () { $(this).remove(); });
        $(this).prev().prev().prev().prev().slideUp(function () { $(this).remove(); });
        $(this).prev().prev().prev().prev().prev().slideUp(function () { $(this).remove(); });
        $(this).prev().prev().prev().prev().prev().prev().slideUp(function () { $(this).remove(); });
        $(this).prev().prev().prev().prev().prev().prev().prev().slideUp(function () { $(this).remove(); });
        $(this).prev().prev().prev().prev().prev().prev().prev().prev().slideUp(function () { $(this).remove(); });
        $(this).next().slideUp(function () { $(this).remove(); });
        $(this).slideUp(function () { $(this).remove(); });
    });

    $('.route').on('click', '.btn-success', function () {
        $(this)
            .after(getAddRemoveButtons())
            .after(getAddressPart('building', 'дом'))
            .after(getAddressPart('street', 'улица'))
            .after(getAddressPart('city', 'населенный пункт'))
            .after(getAddressPart('area', 'область'));
    });

    $('.route').on('click', '.add-route-point', function () {
        $.get(base_API_URL + "GetAreas", function (areas) {
            $('.area').last().empty();
            let idx = $('.city').last().index('.city');
            let street = '.street:eq(' + idx + ')';
            populateSelect('.area', areas, 'guid', 'area', true);
            $.get(base_API_URL + "GetCitiesByArea/" + guid('.area', idx, true), function (cities) {
                $('.city').last().empty();
                populateSelect('.city', cities, 'guid', 'city', true);
                getStreets(idx, street);

                $('.city').on('change', function () {
                    let idx = $(this).index('.city');
                    let street = '.street:eq(' + idx + ')';
                    getStreets(idx, street);
                });
            });
            $('.area').on('change', function () {
                let idx = $(this).index('.area');
                let city = '.city:eq(' + idx + ')';
                let street = '.street:eq(' + idx + ')';
                $.get(base_API_URL + "GetCitiesByArea/" + guid('.area', idx, true), function (cities) {
                    $(city).empty();
                    populateSelect(city, cities, 'guid', 'city', true);
                    getStreets(idx, street);
                });
            });
            $('.street').on('change', function () {
                let idx = $(this).index('.street');
                getBuildings(idx);
            });
        });
    });

    $('.route').on('click', '.btn-success', function () {
        $(this).after(function () {
            let addBtnIdx = $(this).index('.btn-success');
            let nextIdx = addBtnIdx + 1;
            $.get(base_API_URL + "GetAreas", function (areas) {
                populateSelect('.area:eq(' + nextIdx + ')', areas, 'guid', 'area', true);
                $('.area').on('change', function () {
                    let idx = $(this).index('.area');
                    let city = '.city:eq(' + idx + ')';
                    let street = '.street:eq(' + idx + ')';
                    $.get(base_API_URL + "GetCitiesByArea/" + guid('.area', idx, true),
                        function (cities) {
                            $(city).empty();
                            populateSelect(city, cities, 'guid', 'city', true);
                            getStreets(idx, street);
                        });
                });
                $.get(base_API_URL + "GetCitiesByArea/" + guid('.area', nextIdx, false),
                    function (cities) {
                        populateSelect('.city:eq(' + nextIdx + ')', cities, 'guid', 'city', true);
                        $('.city').on('change', function () {
                            let idx = $(this).index('.city');
                            let street = '.street:eq(' + idx + ')';
                            getStreets(idx, street);
                        });
                        $.get(base_API_URL + 'GetStreetsByCity/' + guid('.city', nextIdx, true),
                            function (streets) {
                                populateSelect('.street:eq(' + nextIdx + ')', streets, 'guid', 'street', true);
                                $('.street').on('change', function () {
                                    let idx = $(this).index('.street');
                                    getBuildings(idx);
                                });
                                $.get(base_API_URL + 'GetBuildingsByStreet/' + guid('.street', nextIdx, true),
                                    function (buildings) {
                                        populateSelect('.building:eq(' + nextIdx + ')',
                                            buildings,
                                            'building',
                                            'building',
                                            true);
                                    }
                                );
                            });
                    });
            });
        });
    });

    // update
    $.get(base_API_URL + "GetAreas", function (areas) {
        populateSelect('.area', areas, 'guid', 'area', false);
        for (let i = 0; i < $('.area').length; i++)
            chooseOptionByGuid('.area', '.chosenArea', i);

        for (let i = 0; i < $('.area').length; i++) {
            $('.area:eq(' + i + ') option:selected').val();
            $.get(base_API_URL + "GetCitiesByArea/" + guid('.area', i, true),
                function (cities) {
                    populateSelect('.city:eq(' + i + ')', cities, 'guid', 'city', false);
                    for (let i = 0; i < $('.city').length; i++)
                        chooseOptionByGuid('.city', '.chosenCity', i);
                }
            );
        }
    });

    setTimeout(function () {
        for (let i = 0; i < $('.city').length; i++) {
            $('.city:eq(' + i + ') option:selected').val();
            $.get(base_API_URL + "GetStreetsByCity/" + guid('.city', i, true),
                function (streets) {
                    populateSelect('.street:eq(' + i + ')', streets, 'guid', 'street', false);
                    for (let i = 0; i < $('.street').length; i++)
                        chooseOptionByGuid('.street', '.chosenStreet', i);
                }
            );
        }
    }, 300);

    setTimeout(function () {
        for (let i = 0; i < $('.street').length; i++) {
            $('.street:eq(' + i + ') option:selected').val();
            $.get(base_API_URL + "GetBuildingsByStreet/" + guid('.street', i, true),
                function (buildings) {
                    populateSelect('.building:eq(' + i + ')', buildings, 'building', 'building', false);
                    for (let i = 0; i < $('.building').length; i++)
                        chooseOptionByGuid('.building', '.chosenBuilding', i);
                }
            );
        }
    }, 350);

    $('.area').on('change', function () {
        let idx = $(this).index('.area');
        let city = '.city:eq(' + idx + ')';
        let street = '.street:eq(' + idx + ')';
        $.get(base_API_URL + "GetCitiesByArea/" + guid('.area', idx, true),
            function (cities) {
                $(city).empty();
                populateSelect(city, cities, 'guid', 'city');
                getStreets(idx, street);
            }
        );
    });

    $('.city').on('change', function () {
        let idx = $(this).index('.city');
        let street = '.street:eq(' + idx + ')';
        getStreets(idx, street);
    });

    $('.street').on('change', function () {
        let idx = $(this).index('.street');
        getBuildings(idx);
    });

    function chooseOptionByGuid(select, guidSource, idx) {
        $('' + select + ':eq(' + idx + ') option[value=' + $(guidSource).eq(idx).val() + ']')
            .prop('selected', true);
    }
    // конец udpate

    function getAddressPart(className, title) {
        return '<label>' + title + '</label> ' +
            '<select class="' + className + ' form-control" name="' + className + '"></select>';
    }

    function getAddRemoveButtons() {
        return '<input type="button" class="remove-point btn btn-danger btn-sm" value="x">' +
            '<input type="button" class="btn btn-success" value="+">';
    }

    // Получить улицы по городу
    function getStreets(idx, street) {
        $.get(base_API_URL + "GetStreetsByCity/" + $('.city:eq(' + idx + ') option:selected').val(),
            function (streets) {
                $(street).empty();
                populateSelect(street, streets, 'guid', 'street', true);
                getBuildings(idx);
            }
        );
    }

    // Получить дома по улице
    function getBuildings(idx) {
        $.get(base_API_URL + "GetBuildingsByStreet/" + $('.street:eq(' + idx + ') option:selected').val(),
            function (buildings) {
                let building = '.building:eq(' + idx + ')';
                $(building).empty();
                populateSelect(building, buildings, 'building', 'building', true);
            }
        );
    }

    function populateSelect(item, data, val, text, last) {
        $.each(data, function () {
            $(item + (last ? ':last' : ''))
                .append($('<option></option>')
                    .val(this[val])
                    .text(this[text]));
        });
    }

    function guid(item, idx, selected) {
        return $(item + ':eq(' + idx + ')' +
            (selected ? ' option:selected' : ''))
            .val();
    }
    // ---- END Конфигуратор маршрута

    // ---- START Обновление времени на аукционе, тендере, по рейтингу, в свободном доступе
    function updateTime() {
        setInterval(function () {
            let minutes = $('.minute');
            let seconds = $('.second');
            for (let i = 0; i < minutes.length; i++) {
                seconds[i].innerText--;
                if (seconds[i].innerText <= 0 && minutes[i].innerText != '0') {
                    minutes[i].innerText--;
                    seconds[i].innerText = '59';
                }
                if (parseInt(minutes[i].innerText) <= 0 && parseInt(seconds[i].innerText) <= 0)
                    $('.time')[i].remove();
            }
        }, 1000);
    }


    let controllers = ["Forming", "Auction", "Tender", "Rating", "Free"];
    let url = window.location.href.split('/');
    let controller = url[url.length - 1];
    if (controllers.includes(controller))
        updateTime();

    // ---- END Обновление времени на аукционе, тендере, по рейтингу, в свободном доступе

    // Формирование планируемых дат перевозки на странице создания задания
    if (window.location.href.toLowerCase().includes('claims/create'))
    {
        $('input[name="planDateFrom"]').change(function () {
            let dateStr = $('.planDateFromHidden').val();
            let date = new Date(dateStr);
            let chosenDate = new Date($(this).val());
            if (chosenDate < date) {
                $(this).val(dateStr);
                return;
            }
            let dateFromStr = convertDateTo_MM_DD_YYYY($('input[name="planDateFrom"]').val());
            let planDateFrom = new Date(dateFromStr);
            let planDateTo = new Date(planDateFrom.setDate(planDateFrom.getDate() + 1));
            var options = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };
            planDateTo = planDateTo.toLocaleDateString('ru-RU', options).replace(',', '');
            $('input[name="planDateTo"]').val(planDateTo);
        });
        $('input[name="planDateTo"]').change(function () {
            let dateStr = $('.planDateToHidden').val();
            let date = new Date(dateStr);
            let chosenDate = new Date($(this).val());
            if (chosenDate < date)
                $(this).val(dateStr);
        });
    }

    function convertDateTo_MM_DD_YYYY(dateTime)
    {
        dateTime = dateTime.split(' ');
        let date = dateTime[0].split('.');
        let time = dateTime[1];
        return date[1] + '.' +
               date[0] + '.' +
               date[2] + ' ' +
               time;
    }

    // предотвратить отправку формы по Enter
    //$(window).keydown(function (event) {
    //    if (event.keyCode == 13) {
    //        event.preventDefault();
    //        return false;
    //    }
    //});
});



var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (k = 0; k < y.length; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);