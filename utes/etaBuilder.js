const axios = require('axios')
const moment = require('moment'); 

async function fetchEtasForStop(stopId) {
  const apiUrl = `${process.env.STOP_ETA}${stopId}`;
  try {
    const response = await axios.get(apiUrl);
    const data = response.data


    const responseTimestamp = new Date(response.data.ServiceDelivery.ResponseTimestamp);

    const monitoredStopVisits = response.data.ServiceDelivery.StopMonitoringDelivery.MonitoredStopVisit;


    if (!monitoredStopVisits || monitoredStopVisits.length === 0) {
        console.log("No MonitoredStopVisits available for stopId:", stopId);
        return [];
    }

      // Iterate through the MonitoredStopVisit array and calculate ETAs
      const etas = data.ServiceDelivery.StopMonitoringDelivery.MonitoredStopVisit.map(visit => {
        const expectedArrivalTimeStr = visit.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime;
        const expectedArrivalTime = new Date(expectedArrivalTimeStr);
    
        // Calculate ETA in milliseconds and convert to minutes
        const etaMilliseconds = expectedArrivalTime - responseTimestamp;
        const etaMinutes = Math.floor(etaMilliseconds / 60000); // Convert to minutes
    
        // If ETA is less than a minute, return "Arriving"
        return etaMinutes < 1 ? "Arriving" : etaMinutes + " minutes";
    });
      // Return the ETAs
      return etas;
  } catch (error) {
      console.error("Error fetching ETAs:", error);
      throw error;
  }
}

module.exports = fetchEtasForStop