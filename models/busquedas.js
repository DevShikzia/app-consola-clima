import fs from 'fs'

import axios from 'axios';

class  Busquedas {

        historial = [];
        dbPath = './db/databse.json'

        constructor() {
          // TODO: LEER DB SI EXISTE
          this.leerDB()
        }

        get historialCapitalize(){
         return this.historial.map(lugar => {
          
             let palabras = lugar.split(' ');

             palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

             return palabras.join(' ');

         })
        }

        //Mi resolucion
        // get historialCapitalize(){
        //  return this.historial.map(e => e.charAt(0).toUpperCase() + e.slice(1))
        // }

        get paramsMapbox(){
            return {
                "types": "place",
                "limit" :"5",
                "language" : "es",
                "access_token" : process.env.MAPBOX_KEY
            }
        };

        get paramsOpenWheater(){
            return {
                "lang":"es",
                "units":"metric",
                "appid": process.env.OPENWEATHER_KEY,
            }
        }


        async ciudad(lugar= '') {
            
                try {
                    
                    //peticion http
                    
                    const instance = axios.create({
                        baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                        params : this.paramsMapbox
                    });

                    const resp = await instance.get();
                    
                    return  resp.data.features.map(lugar => ({
                                id: lugar.id,
                                nombre: lugar.place_name,
                                lng: lugar.center[0],
                                lat: lugar.center[1]
                    }));
        

                } catch (error) {
                   
                    return [];
                    
                }
        }

        async climaLugar(lat, lon) {

            try {
                
                const instance = axios.create({
                    baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                    params: {...this.paramsOpenWheater,lat,lon}
                    
                });

                const resp = await instance.get();
                
                //resolucion Prof. Herrera
    
                const {weather,main} = resp.data;

                return {
                    temperatura: main.temp,
                    minima: main.temp_min,
                    maxima: main.temp_max,
                    humedad: main.humidity,
                    estado: weather[0].description
                }



                //Mi resolucion

               /* const weather = weather.find(data => data)
                 
                return {
                    temperatura: resp.data.main.temp,
                    minima: resp.data.main.temp_min,
                    maxima: resp.data.main.temp_max,
                    humedad: resp.data.main.humidity,
                    estado: weather.description
 
                }*/





            } catch (error) {
                return error;
            }
        }

     AgregarHistorial(lugar = ''){

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,9);
       
        this.historial.unshift(lugar.toLocaleLowerCase());


        //Grabar en DB
        this.guardarDB();

        
    }
    guardarDB(){

        const payload = {
            historial: this.historial 
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload, null,' '));

    }

    leerDB(){

        if(!fs.existsSync(this.dbPath)) return 
          
    
          const {historial} = JSON.parse(fs.readFileSync(this.dbPath,'utf-8'));
          
          this.historial = historial;
        

    }
    
}


export  {
    Busquedas, 
}