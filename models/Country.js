import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({
    country_code: { type: String, required: true },
    country_name: { type: String, required: true },
    country_name_d: { type: String },
    country_alpha3_code: { type: String },
    country_numeric_code: { type: Number },
    capital: { type: String },
    country_demonym: { type: String },
    total_area: { type: Number },
    population: { type: Number },
    idd_code: { type: Number },
    currency_code: { type: String },
    currency_name: { type: String },
    currency_symbol: { type: String },
    language_code: { type: String },
    language_name: { type: String },
    cctld: { type: String }
  });
  
  export default  mongoose.model('Country', countrySchema, 'countries');
  

  