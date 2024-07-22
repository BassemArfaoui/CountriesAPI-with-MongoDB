import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"
import bcrypt from "bcrypt";
import auth from 'basic-auth';
import crypto from "crypto";
import jwt from 'jsonwebtoken' ;
import User from "./models/User.js";
import Apikey from "./models/Apikey.js";
import Country from "./models/Country.js";






const app = express();
const port = 3000;
const saltRounds=10;
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';




//mongodb conection 
async function connection() {
  await mongoose.connect('mongodb://127.0.0.1:27017/countries');
  console.log("database connected")
}
connection().catch(err => console.log(err));





//create the user database :











//async functions (database function)
async function getCountries()
{
  try
  {
    const result = await Country.find();
    console.log(result);
    return result;
  }
  catch(err)
  {
    console.log(err);
  }
}

async function getRandomCountry() {
  const randomCountry = await Country.aggregate([{ $sample: { size: 1 } }]);
  return randomCountry;

}

async function getCountryById(id)
{

  const result = await Country.findById(id);
  console.log(result);
  return result;

}

async function getCountryByCode(code)
{
const result = await Country.findOne({country_code:code.toUpperCase()});
console.log(result)
return result;
}

async function getCountryByIdd(idd)
{
const  result= await Country.find({idd_code:idd});
console.log(result);
return result;
}

async function getCountriesByName(name){
  const result = await Country.find({country_name:{ $regex:`^${name}`, $options:'i'}});
  return result;
}
  
async function getCountriesByCapital(capital){
    const result = await Country.find({capital:{ $regex:`^${capital}`, $options:'i'}});
    return result;
}

async function addcountry(country)
{
  const result = await Country.create(country);
  return country;
}

async function updateCountry(id, updates) {
  const result= await Country.updateOne({_id:id},{$set:updates});
  console.log(result);
  return result;
}

async function deleteCountry(id)
{
  const result =await Country.deleteOne({_id:id});
  return result;
}


async function deleteAll()
{
  const result =await Country.deleteMany({});
  console.log(result);
  return {Success:"All countries deleted"};
}

async function addUser(email,password){
  const result=await User.create({email:email,password:password});
  return result;
}


async function addApiKey(api)
{
  const result = await Apikey.create({apikey:api});
  return result;
}



async function getApiKeys()
{
  const result = await Apikey.find().select('apikey');
  return result;
}




// sync functions
function checkPassword(password){
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,}$/;
  return passwordRegex.test(password);
}

function generateApiKey(length) {
  const bytes = crypto.randomBytes(length);
  return bytes.toString('hex');
}





//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());




//custom middleware
// async function authenticateUser(req, res, next){
//   const credentials = auth(req);

//   if (!credentials) {
//     res.statusCode = 401;
//     res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
//     return res.json({ Error: 'Missing credentials' });
//   }

//   const { name, pass } = credentials;

//   try {
//     // Check if the user exists and the password is correct
//     const user = await db.query('SELECT * FROM users WHERE email = $1', [name]);

//     if (user.rows.length === 0 || !(await bcrypt.compare(pass, user.rows[0].password))) {
//       res.statusCode = 401;
//       res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
//       return res.json({ Error: 'Invalid credentials' });
//     }

//     // Authentication successful, call the next middleware
//     next();
//   } catch (err) {
//     console.error(err);
//     res.statusCode = 500;
//     return res.json({ Error: 'Internal Server Error' });
//   }
// };

// async function requireApiKey (req, res, next){
//   console.log(req.headers,'separator', req.query);
//   const apiKey = req.headers.api_key || req.query.api_key;

//   if (!apiKey) {
//     return res.status(401).json({ error: 'Missing API key' });
//   }

//   try {
//     const apikeys=await getApiKeys();
//     let test=false;
//     for (const el of apikeys)
//     {
//       if(await bcrypt.compare(apiKey,el.api_key))
//       {
//         test=true;
//         break;
//       }
//     }


//     if (!test) {
//       return res.status(401).json({ error: 'Invalid API key' });
//     }

//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// async function authenticateToken(req, res, next){
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Missing or invalid authorization header' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     // Verify the token
//     const payload = jwt.verify(token, JWT_SECRET);

//     // Find the user by ID from the token payload
//     const result = await db.query('SELECT * FROM users WHERE id = $1', [payload.userId]);

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid token' });
//     }

//     const user = result.rows[0];

//     // Check if the token matches the stored bearer token
//     if (user.bearer_token !== token) {
//       return res.status(401).json({ error: 'Invalid token' });
//     }

//     // Attach the user information to the request object
//     req.user = user;

//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };











//get routes
app.get('/countries', async (req, res) => {
  const queryParams = req.query;
  try {
    let countries;
    let invalidQuery=false;
      const filters = [];
      const find={$and : filters};

  
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case 'lang':
          filters.push(
            {
            $or: [
              { lang_name: { $regex: `^${value}`, $options: 'i' } },
              { lang_code: { $regex: `^${value}$`, $options: 'i' } }
                 ]
            });
          break;
        case 'curr':
          filters.push({currency_code:value.toUpperCase()});
          break;
        case 'popul':
          filters.push({population : {$gt : value}});
          break;
        case 'area':
          filters.push({total_area : {$gt : value} });
          break;
        default:
          invalidQuery=true;
          break;
      }
    }

    if(invalidQuery)
    {
      throw new Error('Bad Filter');
    }

    if (filters.length === 0) {
      countries = await getCountries();
    } else {
      console.log(find);
      const result = await Country.find(find);
      countries = result;
    }

    res.json(countries);
  } catch (err) {
    console.error(err.message);
    res.status(404).json({ Error: 'Bad Filter ' });
  }
});


app.get('/random', async (req, res) => {
  const country = (await getRandomCountry())[0];
  res.json(country);
});


app.get('/country/id/:id', async (req, res) => {
  const id = req.params.id;
  try{
      const country= await getCountryById(id);
      if (country)
      {
        res.json(country);
      }
      else 
      {
        res.status(404).json({Error:`No Country With ID ${id} `});
      }
    }
    catch(err)
    {
      console.log(err.message);
      res.status(404).json({Error:'Bad Input Or '+`No Country With ID ${id}`})
    }

});


app.get('/country/code/:code', async (req, res) => {
  const code= req.params.code;
  try{
      const country= await getCountryByCode(code);
      if (country)
      {
        res.json(country);
      }
      else 
      {
        res.status(404).json({Error:`No Country With code ${code} `});
      }
    }
    catch(err)
    {
      console.log(err.message);
      res.status(404).json({Error:'Bad Input Type'})
    }

});


app.get('/countries/idd/:idd', async (req, res) => {
  const idd= req.params.idd;
  try{
      const country_arr= await getCountryByIdd(idd);
      if (country_arr.length!==0)
      {
        res.json(country_arr);
      }
      else
      {
        res.status(404).json({Error:`No Country With Idd code ${idd} `});
      }
    }
    catch(err)
    {
      console.log(err.message);
      res.status(404).json({Error:'Bad Input Type'})
    }

});


app.get('/countries/name/:name', async (req, res) => {
  const name= req.params.name;
  try{
      const country_arr= await getCountriesByName(name);
      if (country_arr.length!==0)
      {
        res.json(country_arr);
      }
      else
      {
        res.status(404).json({Error:`No Country With name starting with ${name}`});
      }
    }
    catch(err)
    {
      console.log(err.message);
      res.status(404).json({Error:'Bad Input Type'})
    }

});


app.get('/countries/capital/:capital', async (req, res) => {
  const capital= req.params.capital;
  try{
      const country_arr= await getCountriesByCapital(capital);
      if (country_arr.length!==0)
      {
        res.json(country_arr);
      }
      else
      {
        res.status(404).json({Error:`No Country With capital starting with ${capital} `});
      }
    }
    catch(err)
    {
      console.log(err.message);
      res.status(404).json({Error:'Bad Input Type'})
    }

});



//post request
app.post('/add', async (req, res) => {

  try
  {
    const country = req.body;
    const addedCountry = await addcountry(country);
    res.json(addedCountry);
  } catch (err) {
    console.error(err);
    res.status(400).json({ Error: 'Bad resuest or Internal Server Error' });
  }
});


//patch request
app.patch('/update/:id', async (req, res) => {
  const countryId = req.params.id;
  const updates = req.body;

  try {
    // Update the country data
    const updatedCountry = await updateCountry(countryId, updates);

    if (updatedCountry.matchedCount>0) {
      res.json(await getCountryById(countryId));
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Internal Server Error or Bad input' });
  }
});



 //delete request
app.delete('/delete/:id', async (req, res) => {
  const countryId = req.params.id;
  try {
    const deletedCountry = await deleteCountry(countryId);
    if (deletedCountry.deletedCount>0) {
      res.json({Success:'Country deleted successfully'});
    } else {
      res.status(404).json({ Error: 'Country not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ Error: 'Bad Request' });
  }
});


app.delete('/countries/clear', async (req, res) => {
  try {
    const deletedCountries = await deleteAll();
    res.json({Success:'All Countries deleted successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Authentification
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const checkResult = await User.find({email:email});
    if (checkResult.length > 0) {
      return res.status(400).json({ Error: 'User already exists' });
    }

    // Password strength checks
    if (!checkPassword(password)) {
      return res.status(400).json({
        Error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
      });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ Error: 'Internal Server Error' });
      }

      // Add the user to the database
      const result = await addUser(email, hash);
      return res.status(201).json(result);
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ Error: 'Internal Server Error' });
  }
});



app.get('/apikey',async (req, res) => {
  try
  {
    const api=generateApiKey(25);
    const hashed_api=await bcrypt.hash(api, saltRounds);
    const result=await addApiKey(hashed_api);
    res.json({API_Key:api});
  }
  catch(err)
  {
    console.log(err.message);
    res.status(400).json({Error:'Something went wrong ,Please Try again'});
  }
})


app.post('/bearerToken', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const result = await User.find({email:email});

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result[0];

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Store the token in the users table
    await User.updateOne({$set : {bearer_token : token}});

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



//documentation
app.get('/', async (req,res)=>{

});



 //server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

