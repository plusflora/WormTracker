const axios = require('axios');

async function fetchStopsForRoute(routeId) {
  const apiUrl = `${process.env.ALL_STOPS}${routeId}`;
  try {
      const response = await axios.get(apiUrl);
      const stopsData = response.data.Contents.dataObjects.ScheduledStopPoint; // Adjust according to actual response structure
      // Check if stopsData is an array before processing it
      if (Array.isArray(stopsData)) {
          const processedStops = stopsData.map(stop => ({
              name: stop.Name,
              id: stop.id
          }));
        
          return processedStops;
      } else {

          return []; 
      }
  } catch (error) {
      throw error; 
  }
}

module.exports = fetchStopsForRoute