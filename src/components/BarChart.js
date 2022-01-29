import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { ROOT, BAR_PLANETS} from '../Consts';

import Bar from './Bar';

const BarChart = () => {

    const [planets, setPlanets] = useState({})

    useEffect(() => {
        GetRequestedPlanets();
    }, [])

    const GetRequestedPlanets = async () => {
        var new_planets = {};

        for (const planet of BAR_PLANETS) {
            var resPlanet = await axios.get(`${ROOT}planets/?search=${planet}`);
            var population = resPlanet.data.results[0].population;
            new_planets[planet] = population ;
        }

        setPlanets(new_planets);
    }

    return (
        <div>
            <table style={{width: "100%"}}>
                <tbody>
                    <tr>
                        {Object.entries(planets).map(([planetName, population]) =>
                            <td key={planetName}>
                                <Bar name={planetName} value={population}/>
                            </td>
                        )}
                    </tr>
                </tbody>
            </table>
        </div>
    )
};

// planets = {
//     "Tatooine": 2000,
//         "Alderaan": 900
// }

export default BarChart;

