// Connect to Mosquitto MQTT broker

// // Localhost
// var client = mqtt.connect('wss://test.mosquitto.org:8081/mqtt');

const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

// File paths
const ENDPOINT = "ahye6s6lodn9-ats.iot.ap-northeast-2.amazonaws.com";
const THING_NAME = 'raspberrypi';  // device name
const CERTPATH = "/home/team6/pi-FitbitOAuth-main/raspberrypi.cert.pem"; // cert file path
const KEYPATH = "/home/team6/FitbitOAuth-main/raspberrypi.private.key"; // key file path
const CAROOTPATH = "/home/team6/FitbitOAuth-main/root-CA.crt"; // RootCaPem file path
const TOPIC = 'hikingMetrics/' + loginUserId; // topic name

// MQTT client options
const options = {
    clientId: THING_NAME,
    cert: fs.readFileSync(CERTPATH),
    key: fs.readFileSync(KEYPATH),
    ca: fs.readFileSync(CAROOTPATH),
    rejectUnauthorized: true,
    protocol: 'mqtts'
  };
  
// Connect to the MQTT broker
const client = mqtt.connect(`mqtts://${ENDPOINT}:8883`, options);

// Function executed when connected
client.on('connect', function () {
    console.log('Connected to Mosquitto MQTT broker');

    // Subscribe from topic
    client.subscribe(TOPIC);

    // // Test sample and publishing (Need to change to an annotation form.)
    // const dummyMetrics = [
    //   {
    //     userId: 'BZPGGB',
    //     date: '2024-04-30',
    //     calories: { total: 111 },
    //     steps: { total: 2076 },
    //     duration: { total: 1640000 },
    //     distance: {
    //       total: 1.74,
    //       veryActive: 0.29,
    //       moderatelyActive: 0.61,
    //       lightlyActive: 0.84,
    //       sedentaryActive: 0
    //     }
    //   },
    //   {
    //     userId: 'AAPGGB',
    //     date: '2024-05-01',
    //     calories: { total: 242 },
    //     steps: { total: 4256 },
    //     duration: { total: 3077000 },
    //     distance: {
    //       total: 5.18,
    //       veryActive: 2.93,
    //       moderatelyActive: 1.19,
    //       lightlyActive: 0.98,
    //       sedentaryActive: 0
    //     }
    //   },
    //   {
    //     userId: 'TC15DF',
    //     date: '2024-05-01',
    //     calories: { total: 150 },
    //     steps: { total: 5000 },
    //     duration: { total: 3088800 },
    //     distance: {
    //       total: 1.74,
    //       veryActive: 0.29,
    //       moderatelyActive: 0.61,
    //       lightlyActive: 0.84,
    //       sedentaryActive: 0
    //     }
    //   },
    //   {
    //     userId: 'PP01C5',
    //     date: '2024-05-03',
    //     calories: { total: 105 },
    //     steps: { total: 5000 },
    //     duration: { total: 4077000 },
    //     distance: {
    //       total: 6.12,
    //       veryActive: 2.93,
    //       moderatelyActive: 1.19,
    //       lightlyActive: 0.98,
    //       sedentaryActive: 0
    //     }
    //   },
    //   {
    //     userId: 'RE10GB',
    //     date: '2024-05-04',
    //     calories: { total: 300 },
    //     steps: { total: 8000 },
    //     duration: { total: 8077000 },
    //     distance: {
    //       total: 6.12,
    //       veryActive: 2.93,
    //       moderatelyActive: 1.19,
    //       lightlyActive: 0.98,
    //       sedentaryActive: 0
    //     }
    //   }
    // ]

    // setInterval(function() {  // Callback function
    //   client.publish('hikingMetrics/' + loginUserId, JSON.stringify(dummyMetrics));
    // }, 3000);

    // When a message is received, the function is executed
    client.on('message', function (topic, message) {
        console.log('Received message on topic ' + topic + ': ' + message.toString());

        // Receive message and display them in HTML
        const tableRows = JSON.parse(message).map((metric, index) => {
        const tableRow = document.createElement('tr')

        const rankingColumn = document.createElement('td');
        rankingColumn.classList.add('ranking');
        rankingColumn.textContent = index + 1;
        tableRow.appendChild(rankingColumn);

        const userIdColumn = document.createElement('td')
        userIdColumn.classList.add('userId');
        userIdColumn.innerHTML = metric.userId
        tableRow.appendChild(userIdColumn)

        const weeklyHKTmColumn = document.createElement('td')
        weeklyHKTmColumn.classList.add('weeklyHkTm');
        // convert millisecond to second(divided by 1000)
        // convert second to minute(divided by 60) & convert minute to hour(divided by 60)
        const hours = Math.floor(metric.duration.total / 3600000);
        const minutes = Math.floor((metric.duration.total % 3600000) / 60000);
        weeklyHKTmColumn.textContent = hours + " 시간 " + minutes + " 분";
        tableRow.appendChild(weeklyHKTmColumn)
        
        const weeklyHkDistColumn = document.createElement('td')
        weeklyHkDistColumn.classList.add('weeklyHkDist');
        weeklyHkDistColumn.innerHTML = metric.distance.total + " km"
        tableRow.appendChild(weeklyHkDistColumn)
    
        const caloryColumn = document.createElement('td')
        caloryColumn.classList.add('calories');
        caloryColumn.innerHTML = metric.calories.total + " 칼로리"
        tableRow.appendChild(caloryColumn)

        return tableRow
      })

      // Remove existing template elements
      const tableBody = document.querySelector('table > tbody');
      tableBody.innerHTML = '';
    
      const parent = document.querySelector('table > tbody')
      tableRows.forEach((row) => {
        parent.append(row)
      })
    });
});

// Function is executed, when disconnected
client.on('close', function () {
    console.log('Disconnected from Mosquitto MQTT broker');
});
