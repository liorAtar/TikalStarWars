import React, {useState, useEffect} from 'react';
import axios from 'axios';

const ROOT = "https://swapi.py4e.com/api/";
// Adding docs(documentation string) to everything
// Get the vehicle with the highest sum of population
// UI
// Caching - Axioa multiple times same request
// Var / Let ? What is better?

const Table = () => {
    const [parsedVehicles, setParsedVehicles] = useState([]);
    const [vehiclesWithHighestSum, setVehiclesWithHighestSum] = useState([]);

    useEffect(async () => {
        await GetVehicles();
        GetVehicleWithHighestSum();
    }, [])

    /**
     * Get all the vehicles
     */
    const GetVehicles = async () => {
        var resVehicles = await axios.get(`${ROOT}vehicles`);

        ParseVehicles(resVehicles.data.results);

        while (resVehicles.data.next !== null) {
            resVehicles = await axios.get(resVehicles.data.next);
            await ParseVehicles(resVehicles.data.results);
        }
    }

    const ParseVehicles = async (vehicles) => {
        for (const vehicle of vehicles) {
            if (vehicle.pilots.length > 0) {
                var pilotsUrl = vehicle.pilots;
                const [pilots, planets] = await ParsePilots(pilotsUrl);

                if (pilots.length > 0) {
                    var parsedVehicle = {
                        "name": vehicle.name,
                        "pilots": pilots,
                        "planets": planets,
                        "totalPopulation": SumPopulation(planets)
                    };
                    parsedVehicles.push(parsedVehicle);
                    // setParsedVehicles(prevValue => [...prevValue, parsedVehicle])
                }
            }
        }
    }

    const ParsePilots = async (pilotsUrl) => {
        var pilots = [];
        var planets = {};

        for (const pilotUrl of pilotsUrl) {
            var resPilot = await axios.get(pilotUrl);
            var resPlanet = await axios.get(resPilot.data.homeworld);

            var population = resPlanet.data.population;

            if (population !== "unknown") {
                pilots.push(resPilot.data.name);
                planets[resPlanet.data.name] = population;
            }
        }

        return [pilots, planets];
    }

    const SumPopulation = (planets) => {
        var sum = 0;

        Object.values(planets).forEach(population => {
            sum += parseInt(population);
        });

        return sum;
    }

    const GetVehicleWithHighestSum = () => {
        var highestSum = 0;
        // var vehiclesWithHighestSum = [];

        parsedVehicles.forEach(vehicle => {
            if (vehicle["totalPopulation"] > highestSum) {
                highestSum = vehicle["totalPopulation"];
            }
        })
        
        parsedVehicles.forEach(vehicle => {
            if (vehicle["totalPopulation"] === highestSum) {
                // setVehiclesWithHighestSum(prevValue => [...prevValue, vehicle]);
                vehiclesWithHighestSum.push(vehicle);
            }
        })

        console.log("vehiclesWithHighestSum", vehiclesWithHighestSum)
    }

    return (
        <div>
            
        </div>
    );
};

export default Table;