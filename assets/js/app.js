const API_KEY = "6841e5450643e5d4ff59981dbf58944e";

const daysInTurkish = {

    "Sunday": "Pazar",

    "Monday": "Pazartesi",

    "Tuesday": "Salı",

    "Wednesday": "Çarşamba",

    "Thursday": "Perşembe",

    "Friday": "Cuma",

    "Saturday": "Cumartesi"

};

const weatherVideos = {

"200": "thunderstorm.mp4",

    "201": "thunderstorm.mp4",

    "202": "thunderstorm.mp4",

    "210": "thunderstorm.mp4",

    "211": "thunderstorm.mp4",

    "212": "thunderstorm.mp4",

    "221": "thunderstorm.mp4",

    "230": "thunderstorm.mp4",

    "231": "thunderstorm.mp4",

    "232": "thunderstorm.mp4",

    "300": "rainy.mp4",

    "301": "rainy.mp4",

    "302": "rainy.mp4",

    "310": "rainy.mp4",

    "311": "rainy.mp4",

    "312": "rainy.mp4",

    "313": "rainy.mp4",

    "314": "rainy.mp4",

    "321": "rainy.mp4",

    "500": "rainy.mp4",

    "501": "rainy.mp4",

    "502": "rainy.mp4",

    "503": "rainy.mp4",

    "504": "rainy.mp4",

    "511": "rainy.mp4",

    "520": "rainy.mp4",

    "521": "rainy.mp4",

    "522": "rainy.mp4",

    "531": "rainy.mp4",

    "600": "snowy.mp4",

    "601": "snowy.mp4",

    "602": "snowy.mp4",

    "611": "snowy.mp4",

    "612": "snowy.mp4",

    "613": "snowy.mp4",

    "615": "snowy.mp4",

    "616": "snowy.mp4",

    "620": "snowy.mp4",

    "621": "snowy.mp4",

    "622": "snowy.mp4",

    "701": "windy.mp4",

    "711": "windy.mp4",

    "721": "windy.mp4",

    "731": "windy.mp4",

    "741": "windy.mp4",

    "751": "windy.mp4",

    "761": "windy.mp4",

    "762": "windy.mp4",

    "771": "windy.mp4",

    "781": "windy.mp4",

    "800": "sunny.mp4",

    "801": "cloudy.mp4",

    "802": "cloudy.mp4",

    "803": "cloudy.mp4",

    "804": "cloudy.mp4",

    "900": "thunderstorm.mp4",

    "901": "thunderstorm.mp4",

    "902": "thunderstorm.mp4",

    "903": "cloudy.mp4",

    "904": "sunny.mp4",

    "905": "windy.mp4",

    "906": "snowy.mp4",

    "950": "sunny.mp4",

    "951": "sunny.mp4",

    "952": "windy.mp4",

    "953": "windy.mp4",

    "954": "windy.mp4",

    "955": "windy.mp4",

    "956": "windy.mp4",

    "957": "windy.mp4",

    "958": "windy.mp4",

    "959": "windy.mp4",

    "960": "windy.mp4",

    "961": "windy.mp4",

    "962": "thunderstorm.mp4"

};

 
document.getElementById('geolocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // Burada, lat ve lon değerlerini kullanarak hava durumu verisi çekebilirsiniz.
            console.log('Latitude: ' + lat + ', Longitude: ' + lon);
            // Örneğin hava durumu API'sini çağırmak için burada bir AJAX isteği yapabilirsiniz.
        }, function() {
            alert('Konum bilgilerinizi paylaşmayı reddettiniz.');
        });
    } else {
        alert('Tarayıcınız konum hizmetlerini desteklemiyor.');
    }
});


function updateBackgroundVideo(code) {

    const videoElement = document.getElementById("backgroundVideo");

    if (!videoElement) {

        console.error("Video elementi bulunamadı!");

        return;

    }

    const videoFile = weatherVideos[code] || weatherVideos.default;

    videoElement.src = videoFile;

    videoElement.load();

    videoElement.play();

}

 

function getMeteo(city, callback) {

    $.ajax({

        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,

        dataType: "json",

        success: callback,

        error: function (xhr, status, error) {

            console.error("API isteğinde hata:", status, error);

            callback(null);

        }

    });

}

 

function updateMeteoData(data) {

    if (!data || !data.list) {

        updateBackgroundVideo("default");

        return;

    }

 

    const currentDayData = data.list[0];

    const weatherCode = currentDayData.weather[0].id;

 

    $('#meteo-title span').html('Hava durumu <span class="text-muted meteo-city">' + data.city.name + ', ' + data.city.country + '</span>');

 

    for (let i = 0; i < 3; i++) {

        const meteo = data.list[i * 8];

        const day = $("#meteo-day-" + (i + 1));

 

        let date = moment().add(i, 'days');

        day.find(".name").text(daysInTurkish[date.format("dddd")]);

        day.find(".date").text(date.format("DD/MM"));

 

        const icon = day.find(".meteo-temperature .wi");

        const temperature = day.find(".meteo-temperature .data");

        const humidity = day.find(".meteo-humidity .meteo-block-data");

        const wind = day.find(".meteo-wind .meteo-block-data");

 

        const code = meteo.weather[0].id;

        icon.attr('class', 'wi wi-owm-' + code);

        temperature.text(Math.round(meteo.main.temp) + "°C");

        humidity.text(meteo.main.humidity + "%");

        wind.text(meteo.wind.speed + " km/h");




        let times = SunCalc.getTimes(date.toDate(), data.city.coord.lat, data.city.coord.lon);

 

        var sunrise = pad(times.sunrise.getHours(), 2) + ':' + pad(times.sunrise.getMinutes(), 2);

        var sunset = pad(times.sunset.getHours(), 2) + ':' + pad(times.sunset.getMinutes(), 2);

 

        day.find('.meteo-sunrise .meteo-block-data').text(sunrise);

        day.find('.meteo-sunset .meteo-block-data').text(sunset);

 

    }

    updateBackgroundVideo(weatherCode);




}




$(document).ready(function () {

    let city = "İstanbul";

    $("#meteo-form").submit(function (e) {

        e.preventDefault();

        city = $(this).find("input[name='meteo-city']").val();

        if (!city) {

            console.error("Lütfen bir şehir girin.");

            return;

        }

        getMeteo(city, updateMeteoData);

        return false;

    });

    getMeteo(city, updateMeteoData);

});

 

function pad(num, size) {

    var s = num + "";

    while (s.length < size) s = "0" + s;

    return s;

}

 

function hslToRgb(h, s, l) {

    var r, g, b;

 

    if (s == 0) {

        r = g = b = l; // achromatic

    } else {

        var hue2rgb = function hue2rgb(p, q, t) {

            if (t < 0) t += 1;

            if (t > 1) t -= 1;

            if (t < 1 / 6) return p + (q - p) * 6 * t;

            if (t < 1 / 2) return q;

            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

            return p;

        }

 

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;

        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);

        g = hue2rgb(p, q, h);

        b = hue2rgb(p, q, h - 1 / 3);

    }

 

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];

}
