const toggleContainers = document.querySelectorAll('.toggle-container');
const header = document.querySelector('header');
const main = document.querySelector('main');
const mapButton = document.querySelector('.map-view-button');
const themes = document.querySelectorAll('.theme-component');
const footer = document.querySelector('footer');
const today = document.querySelector('.today');
const tomorrow = document.querySelector('.tomorrow');
const next5Days = document.querySelector('.next-5-days');
const panels = document.querySelectorAll('.weather-panel');
const tabs = [today, tomorrow, next5Days];


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

  const activeTab = localStorage.getItem('activeTab');
  console.log(activeTab)
  tabs.forEach((tab, index) => {
    tab.classList.remove('active-panel');
    panels[index].classList.add('disabled');
    if(tab.textContent == activeTab){
      tab.classList.add('active-panel');
      const targetpanel = document.querySelector(tab.dataset.target);
      console.log(targetpanel.id)
      if(panels[index]==targetpanel){
        panels[index].classList.remove('disabled')
      }
    }
  })
});

function themeUpdate(){
  if(toggleSlider[1].classList.contains('slider-right')){
    console.log('yes')

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
    console.log('no')

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

// weather tabs
const tabsContainer = document.querySelector('.tabs-container');

// Select active tab
tabsContainer.addEventListener('click', (e) => {

  tabs.forEach((tab) => {
    tab.classList.remove('active-panel');  
  });
  e.target.classList.add('active-panel');
  localStorage.setItem('activeTab', e.target.textContent.toString());

  if(e.target.tagName = "li"){    
    const targetpanel = document.querySelector(e.target.dataset.target); 
    panels.forEach((panel) => {
      if(panel==targetpanel){
        panel.classList.remove('disabled')
      } else{
        panel.classList.add('disabled')
      };
      localStorage.setItem('activepanel',panel.classList.toString());
    });
  };

});


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

