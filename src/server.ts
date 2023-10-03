import { serverHTTP } from "./http";
import "./websocket";
serverHTTP.listen(3001, () =>
    console.log("backend is started! 🚀 PORT " + 3001)
);
