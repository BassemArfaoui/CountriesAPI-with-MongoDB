import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    country_code: { type: String, required: true ,default:null},
    country_name: { type: String, required: true  ,default:null},
    country_name_d: { type: String  ,default:null},
    country_alpha3_code: { type: String  ,default:null},
    country_numeric_code: { type: Number  ,default:null},
    capital: { type: String  ,default:null},
    country_demonym: { type: String  ,default:null},
    total_area: { type: Number  ,default:null},
    population: { type: Number  ,default:null},
    idd_code: { type: Number  ,default:null},
    currency_code: { type: String  ,default:null},
    currency_name: { type: String  ,default:null},
    currency_symbol: { type: String  ,default:null},
    lang_code: { type: String  ,default:null},
    lang_name: { type: String  ,default:null},
    cctld: { type: String  ,default:null}
  });
  
  export default  mongoose.model('Country', countrySchema, 'countries');
  

  