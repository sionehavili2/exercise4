import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(-1);
  const [inputClassName, setInputClassName] = useState("");

  useEffect(() => {
    console.log("useEffect running");
    const identifiers = setTimeout(() => {
      console.log(userInput);
    }, 500);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather?lat=40.9805&lon=111.8874&appid=f771cc877321e85654a478233117732d"
        );
        setWeatherData(response.data);
        setIsInputValid(1);
      } catch (error) {
        setIsInputValid(-1);
        console.error("Error fetching data:", error);
        clearTimeout(identifiers);
      }
    };

    fetchData();
    return () => {
      console.log("app.jsx useffect CLEANUP");
      clearTimeout();
    };
  }, []);

  const fetchByCity = async () => {
    //Do nothing if empty
    userInput.trim().length < 1
      ? setInputClassName("invalidInput")
      : setInputClassName("");

    let city = userInput;
    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&appid=f771cc877321e85654a478233117732d"
      );
      setWeatherData(response.data);
      setIsInputValid(1);
    } catch (error) {
      setIsInputValid(0);
      console.error("fetchbyCity Error fetching data:", error.message);
    }
  };

  console.log(userInput);
  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const temperature = weatherData.main.temp;
  const windSpeed = weatherData.wind.speed;
  const humidity = weatherData.main.humidity;
  const cityName = weatherData.name;
  const countryName = weatherData.sys.country;
  const sunriseTime = Date(weatherData.sys.sunrise);

  return (
    <div className="mainContainer">
      <div className="inputContainer">
        <input
          className={inputClassName}
          value={userInput}
          placeholder=" enter city..."
          onChange={(event) => setUserInput(event.target.value)}
        />
        <button onClick={fetchByCity}>Get Weather Info</button>
      </div>

      {isInputValid === -1 && <p>Could not load initial Weather Data</p>}
      {isInputValid === 0 && <p>No Results Found</p>}
      {isInputValid === 1 && (
        <div className="weatherDataContainer">
          <p>
            Location : {cityName}, {countryName}
          </p>
          <p>Temperature : {temperature} K</p>
          <p>Wind Speed : {windSpeed} m/s</p>
          <p>Humidity : {humidity} %</p>
          <p>Sunrise Time: {sunriseTime} </p>
        </div>
      )}
    </div>
  );
}
export default App;
