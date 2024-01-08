const axios = require('axios');
// const NodeCache = require('node-cache')

async function fetchStopsForRoute(routeId) {
  const apiUrl = `${process.env.ALL_STOPS}${routeId}`;
  try {
      const response = await axios.get(apiUrl);
      const stopsData = response.data.Contents.dataObjects.ScheduledStopPoint; // Adjust according to actual response structure
    console.log(stopsData)
      // Check if stopsData is an array before processing it
      if (Array.isArray(stopsData)) {
          const processedStops = stopsData.map(stop => ({
              name: stop.Name,
              id: stop.id
          }));
        
          return processedStops;
      } else {
          console.error("stopsData is not an array:", stopsData);
          return []; 
      }
  } catch (error) {
      console.error("Error fetching stops data:", error);
      throw error; 
  }
}

module.exports = fetchStopsForRoute