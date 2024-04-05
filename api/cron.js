import cron from "node-cron"
import axios from 'axios';
// import https

// const backendUrl = "https://don-backend-zyqg.onrender.com/products";
const backendUrl = "http://localhost:2000/products";

const job = new cron.schedule("*/14 * * * *", async () => {

    try {

        const res = await axios.get(backendUrl);
        if (res.status === 200) {
            console.log("server restarted");
        } else {
            console.log("server failed to start" + res.status);
        }
    } catch (error) {
        console.log(error);
    }
})

export default job;