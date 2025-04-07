const homepageForm = document.getElementById('homepage-form');
const homepageSearchField = document.querySelector('.homepage-search-input');
const homepageSearchButton = document.querySelector('.homepage-search-button');
const toggleContainers = document.querySelectorAll('.toggle-container');
const header = document.querySelector('header');
const main = document.querySelector('main');
const mapButton = document.querySelector('.map-view-button');
const themes = document.querySelectorAll('.theme-component');
const footer = document.querySelector('footer');
const days = document.querySelectorAll('.days');
const daysPanel = document.querySelector('.days-panel');
const detailsPanelContainer = document.querySelector('.details-panel-container');
const form = document.getElementById('search-form');
const searchField = document.querySelector('.city-search-input');
const locatiion = document.querySelector('.location');
const popCities = document.querySelectorAll('.popular-cities');

if(homepageForm){
  homepageForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const city = homepageSearchField.value.trim();
    localStorage.setItem("savedCity", city); // Store the last searched city in local storage

    if (city) {
      // Pass city to dashboard via URL
      window.location.href = `index.html?city=${encodeURIComponent(city)}`;
    }
  });
}

// store site state for reload 
document.addEventListener('DOMContentLoaded', () => {
  const savedCity = localStorage.getItem("savedCity");
  const scaleToggle = document.querySelector('.metric-slider');
  const searchField = document.querySelector('.city-search-input'); 
  const themeToggle = document.querySelector('.theme-toggle-slider');

  if(themeToggle.classList.contains('slider-right')){
    themeUpdate()
  }

  // Use requestAnimationFrame to ensure DOM manipulation happens after rendering
  requestAnimationFrame(() => {
    if (savedCity) {
      searchField.value = savedCity; // Set the saved city to the search field
      locatiion.textContent = savedCity; // Update the location display
      // Check if the metric toggle slider is on the right or left
      let metric;
      if (scaleToggle.classList.contains('slider-right')) {
        metric = 'false'; // If it's on the right, use Fahrenheit
      } else {
        metric = 'true'; // If it's not on the right, use Celsius
      }

      // Fetch and update weather data
      weatherReport(savedCity, metric)
      .then(data => {
        updateDetails(data); // Update the weather details on the page
        console.log(data);
      })
      .catch(err => {
        console.log('Error fetching weather data:', err);
      });
    }
  });
});

function themeUpdate(){
  if(toggleSlider[0].classList.contains('slider-right')){

    themes.forEach(theme =>{
      theme.classList.add('dark-theme');
    });
    header.classList.add('header-dark');
    main.classList.add('body-dark');
    mapButton.classList.add('dark-theme');
    form.classList.add('form-dark');
    footer.classList.add('header-dark');
  }else{
    themes.forEach(theme =>{
      theme.classList.remove('dark-theme')
    });
    header.classList.remove('header-dark');
    main.classList.remove('body-dark');
    mapButton.classList.remove('dark-theme');
    form.classList.remove('form-dark');
    footer.classList.remove('header-dark');
  }
}

function updateToggleStyles(slider) {
  const toggleOption1 = slider.nextElementSibling;
  const toggleOption2 = toggleOption1.nextElementSibling;

  if (slider.classList.contains('slider-right')) {
    toggleOption2.style.color = '#4b5563';
    toggleOption1.style.color = '#ffffff';
  } else {
    toggleOption1.style.color = '#4b5563';
    toggleOption2.style.color = '#ffffff';
  }
}

const toggleSlider = document.querySelectorAll('.slider');
toggleSlider.forEach((slider, index) => {
  const storedState = localStorage.getItem("toggleState_" + index);
  if (storedState) {
    slider.className = "slider " + storedState; // Apply stored classes
    updateToggleStyles(slider);
  }
});

// function to flip individual toggles
toggleContainers.forEach((toggleContainer, index) => {

  toggleContainer.addEventListener('click', (e) => {
    toggleSlider[index].classList.toggle('slider-right');
  
    localStorage.setItem("toggleState_" + index, toggleSlider[index].classList.toString());    
    
    if(toggleContainer.classList.contains('dark-mode-toggle')){
      themeUpdate()
    }
    updateToggleStyles(toggleSlider[index]);
  });
});

const cancel = document.querySelector('.cancel');
cancel.addEventListener('click', e => {
  e.preventDefault
  detailsPanelContainer.classList.add('disabled')
  daysPanel.classList.remove('disabled')

});


// weather reports
async function weatherReport(city, metric){
  const cityInfo = await getCity(city);
  const popCityInfo = await getPopularCities();
  const dailyForecastInfo = await getDailyForecast(cityInfo.Key, metric);

  console.log(popCityInfo)
  return{
    cityInfo,
    popCityInfo,
    dailyForecastInfo,
  }
};

function updateDetails(data){
  days.forEach((day, index) => {
    const weekday = day.querySelector('.weekday')
    const date = day.querySelector('.date');
    const temperature = day.querySelector('.temperature');
    const cloudCover = day.querySelector('.cloud-cover');
    const humidity = day.querySelector('.humidity');
    const windSpeed = day.querySelector('.wind-speed');
    const range = day.querySelector('.range');
    const chanceOfRain = day.querySelector('.rain');

    const minTemp = data.dailyForecastInfo[index].Temperature.Minimum.Value;
    const maxTemp = data.dailyForecastInfo[index].Temperature.Maximum.Value;
    const scale = data.dailyForecastInfo[index].Temperature.Maximum.Unit;
    const avgTemp = Math.round((minTemp + maxTemp) / 2);

    temperature.innerHTML = `${avgTemp}&deg;<span class="scale">${data.dailyForecastInfo[index].Temperature.Maximum.Unit}</span>`;
    range.innerHTML = `${minTemp}&deg;${scale} - ${maxTemp}&deg;${scale}`;
    cloudCover.innerHTML = data.dailyForecastInfo[index].Day.IconPhrase;
    humidity.innerHTML = `${data.dailyForecastInfo[index].Day.RelativeHumidity.Average}%`;
    windSpeed.innerHTML = `${data.dailyForecastInfo[index].Day.Wind.Direction.English} ${data.dailyForecastInfo[index].Day.Wind.Speed.Value} ${data.dailyForecastInfo[index].Day.Wind.Speed.Unit}`;
    chanceOfRain.innerHTML = `${data.dailyForecastInfo[index].Day.RainProbability}%`;
    locatiion.textContent = "  " + (data.cityInfo.EnglishName + ",  " + data.cityInfo.Country.EnglishName)
    if(!day.classList.contains('active-day')){
      day.querySelector('.other-weather-details').classList.add('hidden')
    }
  });

  
  // Function to smoothly transition content with fading
  function updateWithTransition(element, newValue) {
    element.classList.add("fade-out"); // Add fade-out effect
    
    // After fade-out, update content and fade back in
    setTimeout(() => {
      element.innerHTML = newValue; // Update the content
      element.classList.remove("fade-out"); // Remove fade-out and show content
      element.classList.add("fade-in"); // Add fade-in effect
    }, 500); // Wait for the fade-out effect to complete (300ms)
  }
  
  let counter = 0;
  const allCities = data.popCityInfo; // Data containing city information
  const visibleCities = 5; // How many cities to show at a time

  // Start interval to update cities every 4 seconds
  const cityLoop = setInterval(() => {    
    // Get 5 cities starting from the current counter
    const fiveCities = allCities.slice(counter, counter + visibleCities);
  
    // Loop through the 5 cities and update the DOM
    for (let j = 0; j < fiveCities.length; j++) {
      counter++; // Increment the counter to move to the next city
      
      const city = fiveCities[j]; // Get current city from the 5 cities
      const country = popCities[j].querySelector('.country-name');
      const cityName = popCities[j].querySelector('.city-name');
      const temperature = popCities[j].querySelector('.weather-temperature');
      const cloudCover = popCities[j].querySelector('.weather-condition');
      
      // Use the updateWithTransition function to apply fade-out and fade-in
      updateWithTransition(country, city.Country.EnglishName);
      updateWithTransition(cityName, city.EnglishName);
      updateWithTransition(temperature, `${city.Temperature.Metric.Value}&deg;${city.Temperature.Metric.Unit}`);
      updateWithTransition(cloudCover, city.WeatherText);
    }
  
    // After processing 50 cities, reset the counter to loop through them again
    if (counter >= 50) {
      counter = 0; // Reset counter
    }
  }, 5000); // Run the interval every 4 seconds
};

// search form behaviour 
form.addEventListener('submit', async e => {
  e.preventDefault();
  const city = searchField.value.trim();
  const scaleToggle = document.querySelector('.metric-slider');
  let metric;
  if(scaleToggle.classList.contains('slider-right')){
    metric = 'false';
  } else if(!scaleToggle.classList.contains('slider-right')){
    metric = 'true';
  }

  weatherReport(city, metric)
  .then(data => {updateDetails(data)
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  })

});

function updateDetailsPanel(weekday, date, temperature, range, cloudCover, chanceOfRain, humidity, windSpeed, scale) {
  const detailsPanel = document.querySelector('.details-panel');

  detailsPanel.innerHTML = `
    <div class="date weekday-header flex justify-between border-gray-500 border-b py-1 px-4">
      <div class="date-header">
        <span class="weekday font-bold text-lg">${weekday}</span>
        <span class="date">${date}</span>  
      </div>

      <span class="cancel font-semibold text-xl hover:cursor-pointer">X</span>
    </div>
  
    <div class="py-1 flex-1 flex ">
      <div class="weather-details w-[40%] flex flex-col items-center justify-center">
        <div class="weather-icon-containers">
          <i class="fa-solid fa-cloud-sun today-weather-icon weather-icon"></i>
        </div>
  
        <div class="temperature-container text-center">
          <span class="today-temperature font-semibold ">${temperature}</span>
        </div>
      </div>
  
      <div class="other-weather-details w-[50%] flex flex-col justify-center px-4">
        <ul class="today-weather-description-list space-y-1 h-full flex flex-col justify-center border-gray-500 border-opacity-40 border-l pl-2">
          <li class="weather-description unimportant"><strong>Range: </strong><span class="condition range">${range}</span></li>
          <li class="weather-description"><strong>Sky: </strong><span class="condition cloud-cover">${cloudCover}</span></li>
          <li class="weather-description"><strong>Chance of Rain: </strong><span class="condition rain">${chanceOfRain}</span></li>
          <li class="weather-description"><strong>Humidity: </strong><span class="condition humidity">${humidity}</span></li>
          <li class="weather-description unimportant"><strong>Wind Speed: </strong><span class="condition wind-speed">10km/hr</span></li>    
        </ul>
      </div>
    </div>
  `;
  
  const cancel = document.querySelector('.cancel');
  cancel.addEventListener('click', e => {
    e.preventDefault
    detailsPanelContainer.classList.add('disabled')
    daysPanel.classList.remove('disabled')
  })
}

days.forEach(day =>{
  day.addEventListener('click', e =>{
    const weekday = day.querySelector('.weekday').textContent
    const date = day.querySelector('.date').textContent
    const temperature = day.querySelector('.temperature').textContent
    const cloudCover = day.querySelector('.cloud-cover').textContent
    const humidity = day.querySelector('.humidity').textContent
    const windSpeed = day.querySelector('.wind-speed').textContent
    const range = day.querySelector('.range').textContent
    const chanceOfRain = day.querySelector('.rain').textContent
    const scale = day.querySelector('.scale').textContent

    detailsPanelContainer.classList.remove('disabled')
    daysPanel.classList.add('disabled')

    updateDetailsPanel(weekday, date, temperature, range, cloudCover, chanceOfRain, humidity, windSpeed, scale);
  });
})