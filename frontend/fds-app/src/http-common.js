import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3001/sample/getUserList",
  headers: {
    "Content-type": "application/json"
  }
});
