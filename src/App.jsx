import { useEffect, useState } from "react";
import TravelForm from "./Components/TravelForm";
import FlightOffersList from "./Components/FlightOffersList";

function App() {
  const [flightData, setFlightData] = useState(null);

  // When TravelForm finishes an API call, it calls onSearchComplete
  // to store the flight data in this state
  const handleSearchComplete = (data) => {
    // console.log("inside handleSearchComple function");

    setFlightData(data);
  };

  useEffect(() => {
    // if (flightData) {
    //   // console.log("New flight data received:", flightData);
    //   // You can perform additional actions here when flightData updates
    // }
  }, [flightData]);

  return (
    <div>
      <TravelForm onSearchComplete={handleSearchComplete} />
      {flightData && <FlightOffersList flightOffers={flightData} />}
      {/* {flightData?.data && <h1>Shivam</h1>} */}
    </div>
  );
}

export default App;
