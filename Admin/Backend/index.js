const express = require('express');

const app = express();
const PORT = 81 ; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the /public folder




app.get('/login', (req, res) => {



    
})




app.listen(PORT, (req,res) =>
{
    console.log(`Server is running on port ${PORT}`);
})