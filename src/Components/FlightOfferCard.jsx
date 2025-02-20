/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  FormControlLabel,
  Button,
} from "@mui/material";

// A helper to convert "PT11H50M" -> "11h 50m"
const parseDuration = (durationStr) => {
  // e.g. "PT11H50M"
  const match = durationStr.match(/PT(?:(\\d+)H)?(?:(\\d+)M)?/);
  if (!match) return durationStr;
  const hours = match[1] || "0";
  const minutes = match[2] || "0";
  return `${hours}h ${minutes}m`;
};

// A helper to convert "2025-02-21T07:30:00" -> "07:30"
const parseTime = (dateTimeStr) => {
  const dateObj = new Date(dateTimeStr);
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const FlightOfferCard = ({ offer, dictionaries }) => {
  // console.log("inside card");

  console.log("offer", offer);
  console.log("dictionaries", dictionaries);
  // Grab the first itinerary (for a one-way or the outbound portion of a round trip)
  const itinerary = offer?.itineraries?.[0];
  if (!itinerary) {
    return null;
  }

  const segments = itinerary.segments || [];
  if (segments.length === 0) {
    return null;
  }

  // First departure info
  const firstSegment = segments[0];
  const departureTime = parseTime(firstSegment.departure.at);
  // const departureAirport = firstSegment.departure.iataCode;

  // Last arrival info
  const lastSegment = segments[segments.length - 1];
  const arrivalTime = parseTime(lastSegment.arrival.at);
  const arrivalAirport = lastSegment.arrival.iataCode;

  // Duration (e.g. "PT11H50M" => "11h 50m")
  const totalDuration = parseDuration(itinerary.duration);

  // Number of stops is segments.length - 1
  const stops = segments.length - 1;

  // Build a route string like: BOM -> KWI -> LHR
  const route = segments
    .map((seg) => seg.departure.iataCode)
    .concat(arrivalAirport)
    .join(" -> ");

  // Construct flight numbers, e.g. "KU-304 / KU-101"
  const flightNumbers = segments
    .map((seg) => `${seg.carrierCode}-${seg.number}`)
    .join(" / ");

  // Airline name from dictionaries
  const carrierCode = firstSegment.carrierCode;
  const airlineName = dictionaries?.carriers?.[carrierCode] || carrierCode;

  // Price from "offer.price"
  // You could also display "base", "fees", "grandTotal", etc.
  const currency = offer.price.currency; // e.g. "EUR"
  const totalPrice = offer.price.grandTotal; // e.g. "324.98"

  return (
    <Card sx={{ m: 2, p: 2 }}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left Section: Airline & Flight Info */}
        <Box>
          <Typography variant="h6">{airlineName}</Typography>
          <Typography variant="body2">{flightNumbers}</Typography>
          <Typography variant="body2">{route}</Typography>
          <Typography variant="body2">
            {`${totalDuration} • ${stops} stop${stops !== 1 ? "s" : ""}`}
          </Typography>
        </Box>

        {/* Middle Section: Departure & Arrival Times */}
        <Box>
          <Typography variant="h5">
            {departureTime} — {arrivalTime}
          </Typography>
        </Box>

        {/* Right Section: Pricing & Actions */}
        <Box textAlign="right">
          <Typography variant="h6">
            {currency} {totalPrice}
          </Typography>
          <FormControlLabel
            value={offer.id}
            control={<Radio />}
            label="Select"
          />
          <Button variant="outlined" sx={{ mt: 1 }}>
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FlightOfferCard;
