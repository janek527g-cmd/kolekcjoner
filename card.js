var confirmElement = document.querySelector(".confirm");

function closePage(){
  clearClassList();
}

function openPage(page){
  clearClassList();
  var classList = confirmElement.classList;
  classList.add("page_open");
  classList.add("page_" + page + "_open");
}

function clearClassList(){
  var classList = confirmElement.classList;
  classList.remove("page_open");
  classList.remove("page_1_open");
  classList.remove("page_2_open");
  classList.remove("page_3_open");
}

var time = document.getElementById("time");
var options = { year: 'numeric', month: 'numeric', day: '2-digit' };
var optionsTime = { second: 'numeric', minute: 'numeric', hour: '2-digit' };

// ZABEZPIECZENIE: Inicjalizuj zegar tylko jeśli element time istnieje
if (time) {
    if (localStorage.getItem("update") == null){
      localStorage.setItem("update", "21.05.2025")
    }

    var date = new Date();

    var updateText = document.querySelector(".bottom_update_value");
    if (updateText) {
        updateText.innerHTML = localStorage.getItem("update");
    }

    var update = document.querySelector(".update");
    if (update) {
        update.addEventListener('click', () => {
          var newDate = date.toLocaleDateString("pl-PL", options);
          localStorage.setItem("update", newDate);
          if (updateText) {
              updateText.innerHTML = newDate;
          }
          scroll(0, 0)
        });
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    setClock();
    function setClock(){
        date = new Date();
        time.innerHTML = "Czas: " + date.toLocaleTimeString("pl-PL", optionsTime) + " " + date.toLocaleDateString("pl-PL", options);    
        delay(1000).then(() => {
            setClock();
        })
    }
}

var unfold = document.querySelector(".info_holder");
if (unfold) {
    unfold.addEventListener('click', () => {
      if (unfold.classList.contains("unfolded")){
        unfold.classList.remove("unfolded");
      }else{
        unfold.classList.add("unfolded");
      }
    });
}

var data = {}

var params = new URLSearchParams(window.location.search);
for (var key of params.keys()){
  data[key] = params.get(key);
}

// ZAPISZ DANE DO LOCALSTORAGE PRZED WSZELKIMI OPERACJAMI
if (Object.keys(data).length > 0) {
    localStorage.setItem('mObywatelData', JSON.stringify(data));
}

// WCZYTAJ DANE Z LOCALSTORAGE (dla moreid.html)
var storedData = localStorage.getItem('mObywatelData');
if (storedData) {
    data = JSON.parse(storedData);
}

// ZABEZPIECZENIE: Sprawdź czy element istnieje przed ustawieniem tła
var idOwnImage = document.querySelector(".id_own_image");
if (idOwnImage && data['image']) {
    idOwnImage.style.backgroundImage = `url(${data['image']})`;
}

// ZABEZPIECZENIE: Sprawdź czy jesteśmy na stronie card.html przed przetwarzaniem danych
if (window.location.pathname.includes('card.html') || !window.location.pathname.includes('moreid.html')) {
    var birthday = data['birthday'];
    if (birthday) {
        var birthdaySplit = birthday.split(".");
        var day = parseInt(birthdaySplit[0]);
        var month = parseInt(birthdaySplit[1]);
        var year = parseInt(birthdaySplit[2]);

        var birthdayDate = new Date();
        birthdayDate.setDate(day)
        birthdayDate.setMonth(month-1)
        birthdayDate.setFullYear(year)

        birthday = birthdayDate.toLocaleDateString("pl-PL", options);

        var sex = data['sex'];

        if (sex === "m"){
          sex = "Mężczyzna"
        }else if (sex === "k"){
          sex = "Kobieta"
        }

        setData("name", data['name'].toUpperCase());
        setData("surname", data['surname'].toUpperCase());
        setData("nationality", data['nationality'].toUpperCase());
        setData("birthday", birthday);
        setData("familyName", data['familyName']);
        setData("sex", sex);
        setData("fathersFamilyName", data['fathersFamilyName']);
        setData("mothersFamilyName", data['mothersFamilyName']);
        setData("birthPlace", data['birthPlace']);
        setData("countryOfBirth", data['countryOfBirth']);
        setData("adress", data['adress1'] + "<br>" + data['adress2'] + " " + data['city']);

        // NOWE: Aktualizacja danych dowodu
        setData("mdow_series", data['mdow_series'] || '');
        setData("expiry_date", data['expiry_date'] || '');
        setData("issue_date", data['issue_date'] || '');
        setData("father_name", data['father_name'] || '');
        setData("mother_name", data['mother_name'] || '');

        if (localStorage.getItem("homeDate") == null){
          var homeDay = getRandom(1, 25);
          var homeMonth = getRandom(0, 12);
          var homeYear = getRandom(2012, 2019);

          var homeDate = new Date();
          homeDate.setDate(homeDay);
          homeDate.setMonth(homeMonth);
          homeDate.setFullYear(homeYear)

          localStorage.setItem("homeDate", homeDate.toLocaleDateString("pl-PL", options))
        }

        var homeDateElement = document.querySelector(".home_date");
        if (homeDateElement) {
            homeDateElement.innerHTML = localStorage.getItem("homeDate");
        }

        if (parseInt(year) >= 2000){
          month = 20 + month;
        }

        var later;

        if (sex.toLowerCase() === "mężczyzna"){
          later = "0295"
        }else{
          later = "0382"
        }

        if (day < 10){
          day = "0" + day
        }

        if (month < 10){
          month = "0" + month
        }

        var pesel = year.toString().substring(2) + month + day + later + "7";
        setData("pesel", pesel)
    }
}

function setData(id, value){
  var element = document.getElementById(id);
  if (element) {
    element.innerHTML = value;
  }
}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

// Activate bottom nav tab from query param ?tab=home|services|qr|more
(function(){
  try{
    var tab = (new URLSearchParams(window.location.search).get('tab')||'home').toLowerCase();
    var valid = ['home','services','qr','more'];
    if (!valid.includes(tab)) tab = 'home';
    var imgs = document.querySelectorAll('.bottom_element_image');
    var texts = document.querySelectorAll('.bottom_element_text');
    var openClasses = ['home_open','services_open','qr_open','more_open'];
    imgs.forEach(function(img){ openClasses.forEach(c=>img.classList.remove(c)); });
    texts.forEach(function(t){ t.classList.remove('open'); });
    document.querySelectorAll('.bottom_element_grid').forEach(function(el){
      var send = el.getAttribute('send');
      var img = el.querySelector('.bottom_element_image');
      var txt = el.querySelector('.bottom_element_text');
      if (send===tab){ if(img) img.classList.add(tab+'_open'); if(txt) txt.classList.add('open'); }
    });
  }catch(e){}
})();

// OBSŁUGA MOREID.HTML - wczytanie danych z localStorage
if (window.location.pathname.includes('moreid.html')) {
    var moreidData = localStorage.getItem('mObywatelData');
    if (moreidData) {
        var moreidDataObj = JSON.parse(moreidData);
        setData('moreid_mdow_series', moreidDataObj['mdow_series'] || '');
        setData('moreid_expiry_date', moreidDataObj['expiry_date'] || '');
        setData('moreid_issue_date', moreidDataObj['issue_date'] || '');
    }
}
