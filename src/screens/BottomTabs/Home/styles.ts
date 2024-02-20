import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  selectBox: {
    borderColor: "#b8b8b8",
    height: 50,
  },
  selctBoxStyle: {
    borderColor: "#b8b8b8",
    zIndex: 1000,
  },
  button: {
    borderColor: "#b8b8b8",
    borderRadius: 10,
    height: 50,
    borderWidth: 1,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    marginHorizontal: 15,
    marginBottom: "auto",
  },
});
