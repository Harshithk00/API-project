import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
// const port = 3000;
const port = process.env.PORT;
const weatherapi = "d4460951a131f0cf42e08ab5418ffacb";

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

// jokes
app.get("/jokes", async (req, res) => {
    try {
        const result = await axios.get(
            "https://v2.jokeapi.dev/joke/Any?blacklistFlags=religious,racist&type=single"
        );
        const result1 = JSON.stringify(result.data.joke);
        // const result2= result1.replace(/\\/g,'')
        // const result3= result1.replace("\n",'<br>');
        // const result4= result1.replace('."','.<br>');
        // const result5= result1.replace('"','"<br>');
        const result6 = JSON.parse(result1);
        const result5 = result6.replace(/"/g, "<br>");
        res.render("jokes.ejs", { content: result5 });
    } catch (error) {
        res.render("jokes.ejs", { content: JSON.stringify(error.response) });
    }
});

// weather
app.post("/get-weather", async (req, res) => {
    const lat = req.body.lat;
    const lon = req.body.lon;
    try {
        const result = await axios.post(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherapi}`
        );
        const weather1 = JSON.stringify(result.data.weather[0].main);
        const weatherdes1 = JSON.stringify(result.data.weather[0].description);
        const temp1 = JSON.stringify(result.data.main.temp)-273;
        const temp = temp1.toFixed(2);
        const feels1 = JSON.stringify(result.data.main.feels_like)-273;
        const feels = feels1.toFixed(2);
        const temp_min1 = JSON.stringify(result.data.main.temp_min)-273;
        const temp_min = temp_min1.toFixed(2);
        const temp_max1 = JSON.stringify(result.data.main.temp_max)-273;
        const temp_max = temp_max1.toFixed(2);
        const humidity = JSON.stringify(result.data.main.humidity);
        const wind = JSON.stringify(result.data.wind.speed);
        const city1 = JSON.stringify(result.data.name);
        
        const city = city1.replace(/"/g,"");
        const weather = weather1.replace(/"/g,"");
        const weatherdes = weatherdes1.replace(/"/g,"");
        


        res.render("weather.ejs", { lat, lon, weather, weatherdes, temp, feels, temp_min,temp_max,humidity,wind,city });
    } catch (error) {
        res.status(500).json(error.message);
        console.log("err", error.message);
    }
});

//crypto

app.get("/crypto", async (req, res) => {
    try {
        const result = await axios.get(
            "https://api.blockchain.com/v3/exchange/tickers"
        );
        const result1 = JSON.stringify(result.data);
        const result2 = JSON.parse(result1);
        res.render("crypto.ejs", { content: result2 });
    } catch (error) {
        res.render("crypto.ejs", { content: JSON.stringify(error.response) });
    }
});

app.post("/UV", async (req, res) => {
    const lat1 = req.body.lat1;
    const lon1 = req.body.lon1;
    
    try {
        
        const result1 = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat1}&lng=${lon1}`, {
        headers: {
        "x-access-token": "openuv-2qrj6rlo1lulxq-io"
        }
        });
        const UV = JSON.stringify(result1.data.result.uv);
        const UVmax = JSON.stringify(result1.data.result.uv_max);
        
        
        res.render("UV.ejs", {UV:UV, UVmax:UVmax});

    } catch (error) {
        res.render("UV.ejs", { content: JSON.stringify(error.name) });
    }
});


app.listen(port, () => {
    console.log(`app is running on ${port}`);
});
