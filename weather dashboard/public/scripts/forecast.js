const form = document.getElementById('search-form');
const searchField = document.querySelector('.city-search-input');

// get city information
const getCity = async (city) =>{

  const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
  const query = `?apikey=${key}&q=${city}`;

  try {
    const response = await fetch(base + query);
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else{
      const data = await response.json();      
      return data[0]
    }
  } catch (error) {
    console.error('Error fetching city:', error.message);
    return null;
  }
}

const getCurrentCondition = async (cityKey) => {

  const base = 'http://dataservice.accuweather.com/currentconditions/v1/';
  const query = `${cityKey}?apikey=${key}`;

  try {
    const response = await fetch(base + query);
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else{
      const data = await response.json();      
      return data
    }
  } catch (error) {
  
    console.error('Error fetching city:', error.message);
    return null;
  }
}

const getDailyForecast = async (cityKey, metric) => {
  const base = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
  const query = `${cityKey}?apikey=${key}&metric=${metric}`;

  try {
    const response = await fetch(base + query);
    if(!response.ok){
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else{
      const data = await response.json();      
      return data.DailyForecasts
    }
  } catch (error) {
    console.error('Error fetching city:', error.message);
    return null;
  }
}

const dailyForecast = async (citykey) =>{
  const celcuisData = await getDailyForecast(citykey, true)
  const fahrenheitData = await getDailyForecast(citykey, false)

  return {
    celcuisData, 
    fahrenheitData,
  }
}

