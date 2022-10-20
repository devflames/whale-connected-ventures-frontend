import React, { useState, useRef, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
//this import fixes the issue with console.log 
import console from 'console-browserify';
import { useMoralis, useWeb3ExecuteFunction, useMoralisCloudFunction } from "react-moralis";
import helpers from 'Helper';
// core components
import {
    chartExample1,
    chartExample2,
    chartExample3,
    chartExample4
  } from "variables/charts.js";



const TreasuryBlbrChart = (props) => {
    const [theData, setTheData] = useState();
    const [xAxisData, setxAxisData] = useState();
    const [yAxisData, setyAxisData] = useState();
    const { Moralis } = useMoralis();
    const user = Moralis.User.current();

    const data = {
        labels: xAxisData,
        datasets: [
          {
            label: props.chartName,
            data: yAxisData,
            fill: true,
            backgroundColor: "rgba(119,52,169,0)",
            hoverBackgroundColor: "rgba(119,52,169,0)",
            borderColor: "#d048b6",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
          }
        ]
      };


     //load data when hitting page
  useEffect(() => {
    async function getData() {
      try {
        //get games data
        const Data = Moralis.Object.extend("Data");
        const query = new Moralis.Query(Data);
        query.ascending("createdAt");
        const results = await query.find();
        setTheData(results);     
        console.log(results);

        let xaxis = [];
        let yaxis = [];

        results.forEach(element => {
            console.log(element.attributes.createdAt);
            xaxis.push(helpers.getDates(element.attributes.createdAt));
            console.log(element.attributes.treasuryBLBR);
            yaxis.push(element.attributes.treasuryBLBR);
        });
        console.log(xaxis);
        setxAxisData(xaxis);
        console.log(yaxis);
        setyAxisData(yaxis);

      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);

    return (
        <>
        <div className="App">
          <Line data={data} options={chartExample3.options}/>
        </div>
        </>
      )

}

export default TreasuryBlbrChart;