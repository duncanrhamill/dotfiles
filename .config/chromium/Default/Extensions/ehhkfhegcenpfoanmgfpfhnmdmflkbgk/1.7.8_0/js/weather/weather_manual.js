(() => { // make sure arrow functions work

var stored = localStorage;
var errorLogger = console.error.bind(console);
// bg is not ready for a while on Chrome startup
var bg = chrome.extension.getBackgroundPage();
chrome.runtime.getBackgroundPage(bgNew => bg = bgNew); 

refreshWeatherDisplay();

chrome.extension.onMessage.addListener(message => {
  if (message.name == "weather.update") 
    refreshWeatherDisplay();
});

function refreshWeatherDisplay() {
  chrome.runtime.getBackgroundPage(bg => {
    bg.getLocalWeather()
      .then(displayWeatherInfo)
      .catch(errorLogger);
  });
}

//
// Events & Style
//

var forecastStyle = byId('weather-forecast').style;

function forecastFadeIn() {
  forecastStyle.display = 'block';
  clearTimeout(forecastFadeIn.timer);
  forecastFadeIn.timer = setTimeout(_ => forecastStyle.opacity = 1, 10);
}

function forecastFadeOut() {
  clearTimeout(forecastFadeIn.timer);
  forecastFadeIn.timer = setTimeout(_ => forecastStyle.opacity = 0, 200);
}

function showWeatherForecast() {
  bg.getLocalWeather()
    .then(weather => {
      var htmls = weather.forecast.slice(0, 5).map(fc => fc.summary).map(htmlFromWeatherInfo);
      byId('weather-forecast-data').innerHTML = htmls.join('');
      byId('weather-forecast-cond').innerHTML = htmlFromCurrentCondition(weather);
      byId('weather-forecast-city').innerHTML = weather.location.city;
      toggleAccurateLocation(weather.location.accurate);
      forecastFadeIn();
    }).catch(errorLogger);
}

byId('weather-forecast').on('webkitTransitionEnd', () => { 
  if (0 == Number(forecastStyle.opacity)) forecastStyle.display = 'none';
});

byId('weather').on('mouseenter', showWeatherForecast);

byId('weather').on('mouseleave', forecastFadeOut);

byId('weather-forecast').on('mouseenter', forecastFadeIn);
byId('weather-forecast').on('mouseleave',  forecastFadeOut);

var locationIcon = bySelector('.location-icon');
locationIcon.on('mouseenter', function (e) { 
  if (!e.target.classList.contains('disabled')) return;
  byId('weather-forecast-help').style.display = 'block';
});

function toggleAccurateLocation(accurate) {
  if (accurate) bySelector('#weather-forecast-help').style.display = 'none';
  bySelector('#weather-forecast .location-icon').classList.toggle('disabled', !accurate);
  bySelector('#weather-forecast-city').classList.toggle('accurate', !!accurate);
}

byId('weather-unit-option').textContent = temperatureUnit();
byId('weather-unit-option').onclick = function (e) {
  var temp = (this.textContent == 'f') ? 'c' : 'f';
  this.textContent = temp; 
  settings.temperature = temp;
  save_options();
  refreshWeatherDisplay();
  showWeatherForecast();
};

//
// HTML
//

function displayWeatherInfo(weather) {
  return displayWeatherInfoBySVG(weather);
}

// v1: active
function displayWeatherInfoBySVG(weather) {
  var currentWeather = weather.current_observation;
  //console.log('weather: current condition', currentWeather);
  var icon = iconFromWeatherCode(currentWeather);
  var currentIconEl = bySelector('#weather .metric-stat .icon');
  var currentDegreeEl = bySelector('#weather .metric-stat .degree');
  currentIconEl.style.backgroundImage = 'none, url("' + icon + '")';
  currentIconEl.classList.add('svg');
  currentDegreeEl.textContent = toLocaleTemperature(currentWeather.temperature);
}

// v2: unused
function displayWeatherInfoByFont(weather) {
    var currentWeather = weather.condition;
    //console.log('weather: current condition', currentWeather);
    var icon = bySelector('.metric-stat .icon');
    icon.title = currentWeather.text;
    icon.dataset.icon = conditionCharFromCode[currentWeather.code];
    bySelector('.metric-stat .degree').textContent = 
      toLocaleTemperature(currentWeather.temp);
}

function htmlFromWeatherInfo(info) {
  var icon = iconFromWeatherCode(info);
  var style = "background-image:none, url(" + icon + ")";
  var pop = info.pop > 25 ? '<span class="percip-prob">' + info.pop + '</span>' : '';
  return '<div class="metric-stat">' + 
    '<div class="weather-day">' + shortDay(info.day) + '</div>' + 
    '<span class="icon svg" style="'+ style +'" title="'+ info.condition +'">'+ pop +'</span>' + 
    '<span class="degree">' + toLocaleTemperature(info.high) + '</span>' + 
    '<span class="degree low">' + toLocaleTemperature(info.low) + '</span>' + 
  '</div>';
}

function htmlFromCurrentCondition(weather) {
  var current = weather.current_observation;
  return htmlFromStat('Feels', toLocaleTemperature(current.feelslike), temperatureUnitFull()) + 
         htmlFromStat('Humidity', current.humidity, '%') + 
         htmlFromStat('UV', Math.round(current.uv_index), toLocaleUV(current.uv_index)) +
         htmlFromStat('Wind', toLocaleSpeed(current.wind_speed), speedUnit()) +
         htmlFromStat('Rain', toLocalePercip(+current.precip_today), percipUnit());
}

function htmlFromStat(title, value, unit, cls) {
  return  '<div class="weather-stat-col">' +
            '<div class="weather-stat-title">' + title + '</div> ' +
            '<div class="weather-stat-val ' + cls +'">'   + value + '</div>' + 
            '<div class="weather-stat-unit">'  + (unit||'&nbsp;') + '</div>' + 
          '</div>';
}

//
// Conversion
//

function temperatureUnit() {
  var lang = (stored.language || navigator.languages[0]);
  return settings.temperature || ('en-US' == lang ? 'f' : 'c');
}

function temperatureUnitFull() {
  return '°' + temperatureUnit().toUpperCase();
}

function toLocaleTemperature(f) {
  return Math.round('f' == temperatureUnit() ? f : celsiusFromFarenheit(f));
}

function toLocaleSpeed(mph) {
  return Math.round('f' == temperatureUnit() ? mph : mph * 1.609344);
}

function speedUnit() {
  return 'f' == temperatureUnit() ? 'mph' : 'km/h';
}

function toLocalePercip(inch) {
  return 'f' == temperatureUnit() ? inch : Math.round(inch * 25.4);
}

function percipUnit() {
  return 'f' == temperatureUnit() ? 'in.' : 'mm';
}

function shortDay(day) {
  return day.title.slice(0, 3);
}

function toLocaleUV(uv) {
  return uv >= 8 ? 'very high' : (uv >= 6 ? 'high' : (uv >= 3 ? 'moderate' : 'low'));
}

function celsiusFromFarenheit(f) { return (f-32) * 5 / 9; }

function iconFromWeatherCode(weather) {
  weather = convertIconIfWindy(weather);
  var cond = weather.icon;
  cond = convertChances(cond);
  cond = cloudyFromSunny(cond);
  cond = convertDayNightToIconFormat(cond);
  cond = convertCondTerminology(cond);
  cond = cond.replace('mostly', 'mostly-').replace('partly', 'partly-');
  return getWeatherConditionIcons()[cond];
}

function convertChances(cond) {
  // MAYBE: with the percip prob, we could show rain icon with 1-2-3 drops
  //if (cond == 'chancerain') return 'drizzle';
  cond = cond.replace('chancetstorms', 'scattered-thunderstorms-d');
  cond = cond.replace('chancerain', 'scattered-showers');
  cond = cond.replace('chancesnow', 'light-snow-showers');
  return cond.replace('chance', '');
}

function cloudyFromSunny(cond) { 
  return cond.replace('mostlysunny', 'partlycloudy') // TODO: fair-d for small cloud coverage
             .replace('partlysunny', 'mostlycloudy')
}

function convertIconIfWindy(weather) {
  var celsius = celsiusFromFarenheit(weather.temperature || weather.high);
  var wind_kph = (weather.wind_speed || weather.wind_avg_speed) * 1.609344;
  var percipProb = weather.pop || 0;
  if (wind_kph > 10 && (wind_kph >= 1.3*celsius || celsius < 20 && wind_kph >= celsius))
    if (/partlycloudy|clear|sunny/.test(weather.icon) && percipProb < 20)
      weather.icon = 'windy';
  return weather;
}

// Note: drizzle, lightning bolt, etc. icons unused
function convertCondTerminology(cond) {
  var conv = { hazy: 'haze', fog: 'foggy', rain: 'showers', 
               flurries: 'snow-flurries', tstorms: 'thunderstorms' }; 
  return conv[cond] || cond;
}

// clear, mostly/partly cloudy
function hasNightAlternative(cond) {
  return (/clear|fair/i.test(cond) || /(mostly|partly)cloudy/i.test(cond));
}

function convertDayNightToIconFormat(cond) {
  if (!hasNightAlternative(cond)) 
    return cond.replace('nt_', '');
  if (/nt_/.test(cond))
    return cond.replace('nt_', '') + '-n';
  return cond + '-d';
}

// icons: https://output.jsbin.com/joquqiq
function iconFromWeatherCode_OLD(code) {
  var cond = bg.getConditionTextForCode(code);
  cond = cond.replace('mixed', '');
  cond = cond.replace('(night)', 'n');
  cond = cond.replace('(day)', 'd');
  cond = cond.trim();
  cond = cond.replace(/ /g, '-');
  return getWeatherConditionIcons()[cond];
}

function getWeatherConditionIcons() {
  return bg.weather_condition_icons;
}

// for font based images, (not the colored svg ones)
var conditionCharFromCode = "FFFOPXXXXQXRRUUUWXXJMJMFFGYIHEHCBCBXBOOORWUWHOWO".split("");
conditionCharFromCode[3200] = ")";  // "not available" 

})();