/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  IconButton,
  Button,
  Collapse,
  Checkbox,
  Typography,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

const TravelForm = ({ onSearchComplete }) => {
  const [flightInformation, setFlightInformation] = useState({
    tripType: "OfficialBooking",
    tripWay: "OneWay",
    travelClass: "economy",
    passengers: 1,
    origin: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    returnDate: "",
    returnTime: "",
    extraBaggage: false,
    refundable: false,
  });

  const [moreOptions, setMoreOptions] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFlightInformation((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "passengers"
          ? Number(value)
          : value,
    }));
  };

  const handleSwap = () => {
    setFlightInformation((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  // Function to call the Amadeus Flight Offers Search API
  const searchFlights = async () => {
    // Replace with your method of obtaining a valid access token.
    const accessToken = "yNJwTQGw2wwAEQFU9gDo4xRg2HdN";

    // Construct query parameters from form data
    // console.log("flightInformation", flightInformation);
    const queryParams = new URLSearchParams({
      originLocationCode: flightInformation.origin,
      destinationLocationCode: flightInformation.destination,
      departureDate: flightInformation.departureDate,
      adults: flightInformation.passengers,
      travelClass: flightInformation.travelClass,
    });

    // Include returnDate if tripWay is RoundTrip and returnDate is provided
    if (
      flightInformation.tripWay === "RoundTrip" &&
      flightInformation.returnDate
    ) {
      queryParams.append("returnDate", flightInformation.returnDate);
    }

    // Note: Additional parameters (like departureTime, extraBaggage, refundable, etc.)
    // may need to be handled based on your API configuration or mapped appropriately.

    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const flightOffers = await response.json();
      // console.log("Flight Offers:", data);
      onSearchComplete(flightOffers);
      // You can further process the retrieved data as needed.
    } catch (error) {
      console.error("Error fetching flight offers:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Flight Information:", flightInformation);
    await searchFlights();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 700, mx: "auto", p: 2, boxShadow: 3, borderRadius: 2 }}
    >
      {/* Radio Buttons */}
      <FormControl component="fieldset" fullWidth>
        <FormLabel>Trip Type</FormLabel>
        <RadioGroup
          row
          name="tripType"
          value={flightInformation.tripType}
          onChange={handleChange}
        >
          <FormControlLabel
            value="OfficialBooking"
            control={<Radio />}
            label="Official Booking"
          />
          <FormControlLabel
            value="OfficialGuest"
            control={<Radio />}
            label="Official Guest"
          />
          <FormControlLabel
            value="Personal"
            control={<Radio />}
            label="Personal"
          />
        </RadioGroup>
      </FormControl>

      {/* Select Boxes */}
      <FormControl fullWidth sx={{ mt: 5 }}>
        <label style={{ textAlign: "left" }}>Trip Way</label>
        <Select
          name="tripWay"
          value={flightInformation.tripWay}
          onChange={handleChange}
        >
          <MenuItem value="OneWay">One Way</MenuItem>
          <MenuItem value="RoundTrip">Round Trip</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <label style={{ textAlign: "left" }}>Class</label>
        <Select
          name="travelClass"
          value={flightInformation.travelClass}
          onChange={handleChange}
        >
          <MenuItem value="ECONOMY">Economy</MenuItem>
          <MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
          <MenuItem value="BUSINESS">Business</MenuItem>
          <MenuItem value="FIRST">First Class</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
        <label style={{ textAlign: "left" }}>Passengers</label>
        <Select
          name="passengers"
          value={flightInformation.passengers}
          onChange={handleChange}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
        </Select>
      </FormControl>

      {/* Origin and Destination */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        <TextField
          label="Origin"
          fullWidth
          name="origin"
          value={flightInformation.origin}
          onChange={handleChange}
        />
        <IconButton onClick={handleSwap} color="primary">
          <SwapHorizIcon />
        </IconButton>
        <TextField
          label="Destination"
          fullWidth
          name="destination"
          value={flightInformation.destination}
          onChange={handleChange}
        />
      </Box>

      {/* Dates and Times */}
      <Box
        sx={{ display: "grid", gap: 2, mt: 2, gridTemplateColumns: "1fr 1fr" }}
      >
        <TextField
          label="Departure Date"
          type="date"
          name="departureDate"
          InputLabelProps={{ shrink: true }}
          value={flightInformation.departureDate}
          onChange={handleChange}
        />
        <TextField
          label="Departure Time"
          type="time"
          name="departureTime"
          InputLabelProps={{ shrink: true }}
          value={flightInformation.departureTime}
          onChange={handleChange}
        />
        <TextField
          label="Return Date"
          type="date"
          name="returnDate"
          InputLabelProps={{ shrink: true }}
          value={flightInformation.returnDate}
          onChange={handleChange}
        />
        <TextField
          label="Return Time"
          type="time"
          name="returnTime"
          InputLabelProps={{ shrink: true }}
          value={flightInformation.returnTime}
          onChange={handleChange}
        />
      </Box>

      {/* More Options */}
      <Typography
        onClick={() => setMoreOptions(!moreOptions)}
        sx={{
          mt: 2,
          cursor: "pointer",
          color: "primary.main",
          textDecoration: "underline",
        }}
      >
        More Options
      </Typography>
      <Collapse in={moreOptions}>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="extraBaggage"
                checked={flightInformation.extraBaggage}
                onChange={handleChange}
              />
            }
            label={<Typography>Extra Baggage</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="refundable"
                checked={flightInformation.refundable}
                onChange={handleChange}
              />
            }
            label={<Typography>Refundable</Typography>}
          />
        </Box>
      </Collapse>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Search
      </Button>
    </Box>
  );
};

export default TravelForm;
