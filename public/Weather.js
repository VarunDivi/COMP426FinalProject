export class Weather{
    #temperature
    #precipitation
    #humidity
    #wind_speed

    constructor(objJson){
        this.#temperature = objJson.temperature;
        this.#precipitation = objJson.precipitation;
        this.#humidity = objJson.humidity;
        this.#wind_speed = objJson.wind_speed;
    }

    get temperature(){return this.#temperature;}
    get precipitation(){return this.#precipitation;}
    get humidity(){return this.#humidity;}
    get wind_speed(){return this.#wind_speed;}

    static async getWeather(){
        let response = await fetch("http://localhost:3000/weather");
        let objJson = await response.json();
        return new Weather(objJson);
    }
}