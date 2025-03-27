const toggleContainers = document.querySelectorAll('.toggle-container');
const header = document.querySelector('header');
const main = document.querySelector('main');
const mapButton = document.querySelector('.map-view-button');
const themes = document.querySelectorAll('.theme-component');
const footer = document.querySelector('footer');
const days = document.querySelectorAll('.days');
const daysPanel = document.querySelector('.days-panel');
const detailsPanelContainer = document.querySelector('.details-panel-container');


// store site state for reload 
document.addEventListener('DOMContentLoaded', () =>{
  const themes = document.querySelectorAll('.theme-compponent');

  const savedCity = localStorage.getItem("lastCity");
  const savedReport = localStorage.getItem("savedReport");
  console.log(JSON.parse(savedReport))

  if(savedCity){
    searchField.value= savedCity;
  }
  themeUpdate();
});

function themeUpdate(){
  if(toggleSlider[1].classList.contains('slider-right')){
    const form = document.querySelector('.form');

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
    
    themeUpdate()
    updateToggleStyles(toggleSlider[index]);
  });
});

function updateDetailsPanel(weekday, date){
  const detailsPanel = document.querySelector('.details-panel');
  const detailsPanelWeekday = detailsPanel.querySelector('.weekday');
  const detailsPanelWeatherIcon = detailsPanel.querySelector('.weather-icon-containers')
  const detailsPanelTemperature = detailsPanel.querySelector('.today-temperature')
  const detailsPanelScale = detailsPanel.querySelector('.today-scale')

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
          <i class="fa-solid fa-cloud-sun today-weather-icon "></i>
        </div>
  
        <div class="temperature-container text-center">
          <span class="today-temperature font-semibold ">18&deg;</span>
          <span class="today-scale ">C</span>
        </div>
      </div>
  
      <div class="other-weather-details w-[50%] flex flex-col justify-center px-4">
        <ul class="today-weather-description-list space-y-1 h-full flex flex-col justify-center border-gray-500 border-opacity-40 border-l">
          <li class="weather-description"><strong>Weather:</strong> <span class="condition">Cloudy</span></li>
          <li class="weather-description"><strong>Humidity:</strong> <span class="condition">75%</span></li>
          <li class="weather-description"><strong>Wind Speed:</strong> <span class="condition">10 km/h</span></li>    
        </ul>
      </div>
    </div>`

  const cancel = document.querySelector('.cancel');
  cancel.addEventListener('click', e => {
    e.preventDefault
    detailsPanelContainer.classList.add('disabled')
    daysPanel.classList.remove('disabled')

  })

}

days.forEach((day) =>{
  day.addEventListener('click', e =>{
    const weekday = day.querySelector('.weekday').textContent.toString();
    const date = day.querySelector('.date').textContent.toString();

    detailsPanelContainer.classList.remove('disabled')
    daysPanel.classList.add('disabled')

    updateDetailsPanel(weekday, date)
  })

})

const cancel = document.querySelector('.cancel');
cancel.addEventListener('click', e => {
  e.preventDefault
  detailsPanelContainer.classList.add('disabled')
  daysPanel.classList.remove('disabled')

})


// weather reports
const weatherReport = async (city) => {
  const cityInfo = await getCity(city);
  const currentWeatherInfo = await getCurrentCondition(cityInfo.Key);
  const dailyForecastInfo = await dailyForecast(cityInfo.Key);

  return{
    cityInfo,
    currentWeatherInfo,
    dailyForecastInfo,
  }
};

// search form behaviour 
form.addEventListener('submit', async e => {
  e.preventDefault();

  const city = searchField.value.trim();

  const report = await weatherReport(city);

  localStorage.setItem("lastCity", city);
  localStorage.setItem("savedReport", JSON.stringify(report));

  console.log(report);

})

