import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [query, setQuery] = useState('');
  const [tooManyMatches, setTooManyMatches] = useState(false);
  const [weather, setWeather] = useState(null);
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  useEffect(() => {
    const handleSearch = () => {
      if (query.length === 0) {
        setCountries([]);
        setSelectedCountry(null);
        setTooManyMatches(false);
        return;
      }

      axios
        .get(`https://restcountries.com/v3.1/name/${query}`)
        .then((response) => {
          const data = response.data;
          if (data.length > 10) {
            setCountries([]);
            setSelectedCountry(null);
            setTooManyMatches(true);
          } else if (data.length > 1) {
            setCountries(data);
            setSelectedCountry(null);
            setTooManyMatches(false);
          } else if (data.length === 1) {
            setCountries([]);
            setTooManyMatches(false);
            setSelectedCountry((prevSelectedCountry) => {
              if (prevSelectedCountry !== data[0]) {
                return data[0];
              }
              return prevSelectedCountry;
            });
          } else {
            setCountries([]);
            setSelectedCountry(null);
            setTooManyMatches(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    handleSearch();
  }, [query]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (selectedCountry && apiKey) {
        const capital = selectedCountry.capital;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
          );
          setWeather(response.data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    fetchWeatherData();
  }, [selectedCountry, apiKey]);

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div>
      <form>
        find countries
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {tooManyMatches && <p>Too many matches, please make your query more specific.</p>}

      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area}</p>
          <b>Languages:</b>
          <ul>
            {Object.values(selectedCountry.languages).map((lang, index) => (
              <li key={index}>{lang}</li>
            ))}
          </ul>
          {selectedCountry.flags && (
            <img
              src={selectedCountry.flags.png}
              alt={`${selectedCountry.name.common}'s flag`}
              style={{ maxWidth: '200px' }}
            />
          )}
          {weather && (
            <div>
              <h3>Weather in {selectedCountry.capital}</h3>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Weather: {weather.weather[0].description}</p>
            </div>
          )}
        </div>
      )}

      {countries.length > 1 && !tooManyMatches && (
        <ul>
          {countries.map((country) => (
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleCountryClick(country)}>Show Details</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
