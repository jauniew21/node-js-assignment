const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();

// set up driver information
const driverFile = "drivers.json";
const driverPath = path.join(__dirname, "data", driverFile);
const driverData = fs.readFileSync(driverPath, "utf8");

// set up constructor information
const constructorFile = "constructors.json";
const constructorPath = path.join(__dirname, "data", constructorFile);
const constructorData = fs.readFileSync(constructorPath, "utf8");

// set up race information
const raceFile = "races.json";
const racePath = path.join(__dirname, "data", raceFile);
const raceData = fs.readFileSync(racePath, "utf8");

// set up circuit information
const circuitFile = "circuits.json";
const circuitPath = path.join(__dirname, "data", circuitFile);
const circuitData = fs.readFileSync(circuitPath, "utf8");

// set up results information
const resultsFile = "results.json";
const resultsPath = path.join(__dirname, "data", resultsFile);
const resultsData = fs.readFileSync(resultsPath, "utf8");

// all json data
const drivers = JSON.parse(driverData);
const constructors = JSON.parse(constructorData);
const races = JSON.parse(raceData);
const circuits = JSON.parse(circuitData);
const results = JSON.parse(resultsData);

// defining handlers for different routes
// get all circuits
app.get("/api/circuits/", (req, resp) => { getAll(req, resp, circuits) });

// get specific circuit
app.get("/api/circuits/:circuitId", (req, resp) => 
    getOne(req, resp, circuits, "circuitId")
);

// get all constructors
app.get("/api/constructors/", (req, resp) => getAll(req, resp, constructors));

// get specific constructor
app.get("/api/constructors/:constructorRef", (req, resp) => 
    getOne(req, resp, constructors, "constructorRef")
);

// get the results of a constructor in a specific season 
app.get("/api/constructorResults/:constructorRef/:year", (req, resp) => {
        const ref = req.params.constructorRef;
        const season = parseInt(req.params.year);
        const specifiedResults = results.filter(result => result.constructor.ref === ref 
            && result.race.year === season);
        resp.json(specifiedResults);
    }
);

// get all drivers
app.get("/api/drivers/", (req, resp) => getAll(req, resp, drivers));

// get specific driver
app.get("/api/drivers/:driverRef", (req, resp) => 
    getOne(req, resp, drivers, "driverRef")
);

// get the results of a driver in a specific season 
app.get("/api/driverResults/:driverRef/:year", (req, resp) => {
    const ref = req.params.driverRef;
    const season = parseInt(req.params.year);
    const specifiedResults = results.filter(result => result.driver.ref === ref 
        && result.race.year === season);
    resp.json(specifiedResults);
    }
);

// get all races
app.get("/api/races/", (req, resp) => getAll(req, resp, races));

// get races from a specific season
app.get("/api/races/season/:year", (req, resp) =>
    getSome(req, resp, races, "year")
);

// gets specific race
app.get("/api/races/id/:id", (req, resp) =>
    getOne(req, resp, races, "id")
);

// get all the results of a race (id)
app.get("/api/results/race/:id", (req, resp) => {
        const raceId = parseInt(req.params.id);
        const specifiedResults = results.filter(result => result.race.id === raceId);
        resp.json(specifiedResults);
    }
);

// get all the races in a season
app.get("/api/results/season/:year", (req, resp) => {
        const season = parseInt(req.params.year);
        const specifiedResults = results.filter(result => result.race.year === season);
        resp.json(specifiedResults);
    }
);

app.listen(8080, () => {
    console.log("listening for requests on port 8080");
})

// get all the data from a JSON file
getAll = (req, resp, jsonData) => { resp.json(jsonData) }

// get a specific object from a JSON file
getOne = (req, resp, jsonData, param) => { 
    const exact = jsonData.find(d => d[param] == req.params[param]);
    resp.json(exact);
}

// get objects from a JSON file with a specific parameter
getSome = (req, resp, jsonData, param) => { 
    const group = jsonData.filter(d => d[param] == req.params[param]);
    resp.json(group);
}