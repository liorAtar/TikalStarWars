import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { ROOT, BAR_PLANETS} from '../Consts';

import Bar from './Bar';

const BarChart = () => {

    const [planets, setPlanets] = useState({})

    useEffect(() => {
        /** Get the requested planets population to show in the bar chart */
        GetRequestedPlanets();
    }, [])

    /**
     * Get the requested planets data
     */
    const GetRequestedPlanets = async () => {
        var planetsInBarChart = {};

        /** Go thorugh each planet from the requested planets to show in the bar chart */
        for (const planet of BAR_PLANETS) {
            /** Gets the current planet */
            var resPlanet = await axios.get(`${ROOT}planets/?search=${planet}`);

            /** Update the current planet population */
            var population = resPlanet.data.results[0].population;

            /** Add the planet and its population value to the planets to show in the bar chart */
            planetsInBarChart[planet] = population ;
        }

        /** Update the planets state */
        setPlanets(planetsInBarChart);
    }

    return (
        <div>
            <h4>Bar chart that compares the home planets’ own population</h4>
            <table style={{ width: "100%", border: "1px solid black"}}>
                <tbody>
                    <tr>
                        {Object.entries(planets).map(([planetName, population]) =>
                            <td key={planetName} style={{ verticalAlign: "bottom"}}>
                                <Bar name={planetName} value={population}/>
                            </td>
                        )}
                    </tr>
                </tbody>
            </table>
        </div>
    )
};

export default BarChart;

