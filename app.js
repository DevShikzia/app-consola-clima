import * as dotenv from 'dotenv'
dotenv.config()


import { leerInput,
        inquirerMenu, 
        pause,
        listarLugares} from "./helpers/inquirer.js"
import { Busquedas } from "./models/busquedas.js";


const main = async() => {


   const busquedas = new Busquedas();
   let opt = Number;
   

  
   do {
    
    opt = await inquirerMenu();
    
     switch(opt){
         case 1:
               // Mostrar mensaje
                  const termino = await leerInput('Ciudad:');
                 
                  // Buscar los lugares
                 
                  const lugares = await busquedas.ciudad(termino);
                  
                  // Seleccionar el lugar 
                  
                  const id = await listarLugares(lugares);
                  
                  if(id === '0') continue;

                  const {nombre,lat,lng} = lugares.find( l => l.id === id);              
                  
                  // guuardar en DB
                  busquedas.AgregarHistorial(nombre);


               // Clima 

               const {temperatura,minima,maxima,humedad,estado} = await busquedas.climaLugar(lat,lng);
                
                
               // Mostrar resultados
               console.log('\nInformacion de la ciudad\n'.yellow);
               console.log('Ciudad:'.magenta, nombre.green);
               console.log('Lat:'.magenta,lat);
               console.log('Lng:'.magenta,lng);
               console.log('Temperatura:'.magenta,(Math.round(temperatura)+'°').yellow);
               console.log('Minima:'.magenta, (Math.round(minima)+'°').yellow);
               console.log('Maxima:'.magenta, (Math.round(maxima)+'°').yellow);
               console.log('Humedad:'.magenta, (humedad+"%").yellow);
               console.log('Estado actual del cielo :'.magenta, estado.green);
         break;

         case 2:
                   busquedas.historialCapitalize.forEach((lugar,i) =>{
                     const idx =  `${i + 1}.`.yellow

                        console.log(`${idx} ${lugar.green}`)

                   })
         break;
     }
    
  if(opt !==0) await pause();

   } while (opt !== 0);

}


main()