import React, { useContext } from "react";
import { Popup } from "react-mapbox-gl";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import DaysOpenChip from "./DaysOpenChip";
import HouseholdSizeChip from "./HouseholdSizeChip";
import DrivingClusterChip from "./DrivingClusterChip";
import { daysSinceSlackMessage } from "../helpers/time";
import ClusterMapContext from "../context/ClusterMapContext";

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  closeIcon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  root: {
    position: "relative",
  },
  chipRow: {
    "& > *": {
      marginRight: theme.spacing(0.5),
    },
    marginTop: theme.spacing(2),
  },
}));

const RequestPopup = ({ requests, closePopup }) => {
  const classes = useStyles();
  const { t: str } = useTranslation();
  const { _focusedRequestId, setFocusedRequestId } = useContext(
    ClusterMapContext
  );

  return (
    <Popup
      coordinates={requests[0].lngLat}
      offset={{
        "bottom-left": [6, -19],
        bottom: [0, -19],
        "bottom-right": [-6, -19],
      }}
    >
      {requests.map(({ meta }, i) => (
        <Box
          key={meta.Code}
          className={classes.root}
          onClick={() => {
            setFocusedRequestId(meta.Code);
          }}
        >
          <CloseIcon
            onClick={closePopup}
            fontSize="small"
            className={classes.closeIcon}
          />
          <Typography variant="h6">
            {meta.slackPermalink ? (
              <Link
                href={meta.slackPermalink}
                underline="always"
                target="_blank"
              >
                {meta["First Name"]}
              </Link>
            ) : (
              meta["First Name"]
            )}
          </Typography>

          <Typography variant="body1">
            {meta["Cross Street #1"]}
            {" and "}
            {meta["Cross Street #2"]}
          </Typography>

          <Typography variant="body2">
            {str("webapp:deliveryNeeded.popup.requestCode", {
              defaultValue: `Request code:`,
            })}
            {meta.Code}
          </Typography>

          <Box className={classes.chipRow}>
            <HouseholdSizeChip size={meta["Household Size"]} />

            {meta["For Driving Clusters"] && <DrivingClusterChip />}

            {meta.slackPermalink ? (
              <DaysOpenChip daysOpen={daysSinceSlackMessage(meta.slackTs)} />
            ) : (
              <Typography variant="body2" color="error">
                {str(
                  "webapp:deliveryNeeded.popup.cantFindSlack",
                  `Can't find Slack link, please search for request code in Slack.`
                )}
              </Typography>
            )}
          </Box>

          {i !== requests.length - 1 && <Divider className={classes.divider} />}
        </Box>
      ))}
    </Popup>
  );
};

export default RequestPopup;
