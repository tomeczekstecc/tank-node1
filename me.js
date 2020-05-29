const fs = require("fs");
const Gpio = require("pigpio").Gpio;
const axios = require("axios");

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6 / 34321;

const trigger = new Gpio(23, { mode: Gpio.OUTPUT });
const echo = new Gpio(24, { mode: Gpio.INPUT, alert: true });

trigger.digitalWrite(0); // Make sure trigger is low

const watchHCSR04 = () => {
  let startTick;

  echo.on("alert", (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      const result = Math.floor(diff / 2 / MICROSECDONDS_PER_CM);
      
      const measureObj  = {
       taken: Date.now(),
       area: 'stec',
       tank_name: 'stec_ogrod',
       distance: result
    }
saveMeasureToDB(measureObj)
  }
 });
};

watchHCSR04();

// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1);
 
}, 10000);

async function saveMeasureToDB(measureO) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(
      `https://protected-escarpment-03483.herokuapp.com/api/v1/measures/${measureO.taken}/${measureO.area}/${measureO.tank_name}/${measureO.distance}`,
      config
    );
  } catch (err) {
    console.log(err);
  }
}
