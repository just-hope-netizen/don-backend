import cron from "node-cron"
import axios from 'axios';

const backendUrl = "https://don-backend-zyqg.onrender.com/products";

const job = new cron.schedule("*/1 * * * *", async () => {

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