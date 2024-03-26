const tableTypes = {
  CITY: "City",
  SENDER: "Sender",
  TRANSPORTER: "Transporter",
  DESTINATION: "Destination",
  SENDER_DESTINATION: "Sender_destination",
  UNKNOWN: "Unknown"
};

export const isUnknown = val => tableTypes.UNKNOWN === val

export default tableTypes