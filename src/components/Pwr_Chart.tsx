import { Chart as ChartJS, registerables } from "chart.js";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { listen } from "@tauri-apps/api/event";
import "chartjs-adapter-moment";
import { useQuery } from "react-query";

ChartJS.register(...registerables);

interface LineChartProps {
  data: any;
  options: any;
}

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  return <Line data={data} options={options} />;
};

type Payload = {
  message: string;
};

const newData: Number[] = [0];
const newLabels: string[] = [new Date().toLocaleTimeString()];

const fetchData = () => {
  return new Promise((resolve) => {
    listen<Payload>("updateSerial", (event) => {
      const n = event?.payload?.message?.split(":");
      if (n.length < 2) {
        return;
      }
      const v = n[1].trim();
      if (isNaN(parseFloat(v))) {
        return;
      }
      const f = parseFloat(v);
      newData.push(f);

      newLabels.push(new Date().toLocaleTimeString());
      resolve({
        labels: newLabels,
        datasets: [
          {
            label: "Real-Time Data",
            data: newData,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
          },
        ],
      });
    });
  });
};

export default function Pwr_Chart() {
  // @ts-ignore
  const { data, isLoading, error } = useQuery({
    queryKey: ["updateSerial"],
    queryFn: () => fetchData().then((res) => res),
    refetchInterval: 1000,
  });

  if (error) {
    console.log("fetch-err : ", error);
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  if (isLoading) {
    return;
  }

  if (data) {
    console.log("data=x ", data);
    return (
      <div>
        <LineChart data={data} options={options} />
      </div>
    );
  }
}
