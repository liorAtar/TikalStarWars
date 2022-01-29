import React, { useState, useEffect } from 'react';

import axios from 'axios';

import './App.css';
import Table from './components/Table';
import BarChart from './components/BarChart';
import { ROOT } from './Consts';

function App() {

  const [parsedVehicles, setParsedVehicles] = useState([]);
  const [vehiclesWithHighestSum, setVehiclesWithHighestSum] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    /** Gets all vehicles if the currewnt list is empty */
    if (parsedVehicles.length === 0) {
      GetVehicles();
    }

    /** Gets the vehicles with the highest sum of population */
    if (isFinished) {
      GetVehicleWithHighestSum();
    }
  }, [isFinished])

  /**
   * Get all the vehicles and update the parsed vehicles state
   */
  const GetVehicles = async () => {
    /** Gets vehicles at current page */
    var resVehicles = await axios.get(`${ROOT}vehicles`);

    /** Gets each vehicles pilots and planets and update the parsedVehicles state */
    await ParseVehicles(resVehicles.data.results);

    /** Check if there is a next page to vehicles */
    while (resVehicles.data.next !== null) {
      /** Gets vehicles at current page */
      resVehicles = await axios.get(resVehicles.data.next);
      /** Gets each vehicles pilots and planets and update the parsedVehicles state */
      await ParseVehicles(resVehicles.data.results);
    }

    /** Update that all requested vehicles was fetched */
    setIsFinished(true);
  }

  /**
   * Gets each vehicle pilots and plantes, then update the parsed vehicles state
   * @param {*} vehicles Current vehicles that was fetched
   */
  const ParseVehicles = async (vehicles) => {
    /** Go thorugh all the vehicles */
    for (const vehicle of vehicles) {

      /** Check if the current vehicle has pilots */
      if (vehicle.pilots.length > 0) {
        var pilotsUrl = vehicle.pilots;
        /** Fetch the vehicle pilots and their planet */
        const [pilots, planets] = await ParsePilots(pilotsUrl);

        /** Check if pilots is not empty */
        if (pilots.length > 0) {
          var parsedVehicle = {
            "name": vehicle.name,
            "pilots": pilots,
            "planets": planets,
            "totalPopulation": SumPopulation(planets)
          };

          /** Update the parsed vehicles state with the new value */
          setParsedVehicles(prevValue => [...prevValue, parsedVehicle]);
        }
      }
    }
  }

  /**
   * Fetch pilots and their planets
   * @param {*} pilotsUrl Pilots url to fetch each pilot data
   * @returns pilots and their plantes
   */
  const ParsePilots = async (pilotsUrl) => {
    var pilots = [];
    var planets = {};

    /** Go thorugh all the pilots url */
    for (const pilotUrl of pilotsUrl) {
      /** Fetch the pilot data */
      var resPilot = await axios.get(pilotUrl);

      /** Fetch the planet data */
      var resPlanet = await axios.get(resPilot.data.homeworld);

      var pilotName = resPilot.data.name;
      var planetName = resPlanet.data.name;
      var population = resPlanet.data.population

      /** Check if the population of the current planet is not unknown */
      if (population !== "unknown") {
        /** Add the current pilot name to the pilots list */
        pilots.push(pilotName);
        /** Add the current planet name and population to the planets object */
        planets[planetName] = population;
      }
    }

    return [pilots, planets];
  }

  /**
   * Sum all planets population
   * @param {*} planets The planets to sum their population
   * @returns Sum of population
   */
  const SumPopulation = (planets) => {
    var sum = 0;

    /** Go thorugh each planet population and its value to sum */
    for (const population of Object.values(planets)) {
      sum += parseInt(population);
    }

    return sum;
  }

  /**
   * Gets and update the vehicles with the highest population
   */
  const GetVehicleWithHighestSum = () => {
    var highestSum = 0;

    /** Go thorugh each vehicle from the parsed vehicles state */
    for (const vehicle of parsedVehicles) {
      /** Check if the current vehicle total population is greater than the current highest sum */
      if (vehicle["totalPopulation"] > highestSum) {
        /** Update the highest sum to the current vehicle total population */
        highestSum = vehicle["totalPopulation"];
      }
    }

    /** Go thorugh each vehicle from the parsed vehicles state */
    for (const vehicle of parsedVehicles) {
      /** Check if the current vehicle total population is equal to the current highest sum */
      if (vehicle["totalPopulation"] === highestSum) {
        /** Update the vehicles with the highest sum with the current vehicle */
        setVehiclesWithHighestSum(prevValue => [...prevValue, vehicle]);
      }
    }
  }

  return (
    <div className="App">
      <h1>Star Wars</h1>
      <Table vehiclesWithHighestSum={vehiclesWithHighestSum} />
      <BarChart />
    </div>
  );
}

export default App;
