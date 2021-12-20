import useFetch from "../../hooks/useFetch";
import BoardingHouseList from "./BoardingHouseList";
import LoadingState from "../LoadingState";
import { Typography } from "@mui/material";

const AllByZone = ({ zone }) => {
  const { data, isPending, error } = useFetch(
    `http://localhost:3500/api/boarding-houses/by-zone/${zone}`
  );
  return (
    <>
      {error && (
        <Typography variant="overline" color="initial">
          {error}
        </Typography>
      )}
      {data && data.length <= 0 ? (
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ fontFamily: "Quicksand", fontSize: 15, py: 5 }}
        >
          {" "}
          NO BOARDING HOUSE IN{" "}
          {zone.charAt(0).toUpperCase() + zone.slice(1).replace(/-/g, " ")}
        </Typography>
      ) : (
        <BoardingHouseList boardinghouses={data} />
      )}
      {isPending && <LoadingState />}
    </>
  );
};

export default AllByZone;