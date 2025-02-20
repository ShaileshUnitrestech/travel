/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import FlightOfferCard from "./FlightOfferCard";

// Receives the full API response (including "data" array & "dictionaries")
// and maps each flight-offer to a FlightOfferCard
const FlightOffersList = ({ flightOffers }) => {
  console.log("flightOffers inside FlightOffersList", flightOffers);

  return (
    <>
      {!flightOffers?.data?.length ? (
        <Typography sx={{ mt: 2 }}>
          No flight data available. Please search again.
        </Typography>
      ) : (
        flightOffers.data.map((offer) => (
          <>
            {/* <h1>Shivam</h1> */}
            <FlightOfferCard
              key={offer.id}
              offer={offer}
              dictionaries={flightOffers.dictionaries}
            />
          </>
        ))
      )}
    </>
  );
};

export default FlightOffersList;
