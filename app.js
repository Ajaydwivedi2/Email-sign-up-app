require('dotenv').config();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/signup.html");  
});

app.post("/", function(req, res){

    var fName = req.body.firstName;
    var lName = req.body.lastName;
    var email = req.body.email;  

    mailchimp.setConfig({
      apiKey:process.env.SECRET_KEY,
      server: "us21",
    });
    
    const list_id = "68eb765b06";

    const run = async () => {
        const response = await mailchimp.lists.batchListMembers(list_id, {
          members: [{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:fName,
                LNAME:lName
            }
          }],
        });
        console.log(response);
        
        if(response.error_count === 0 ){

          res.sendFile(__dirname + "/success.html")

        }else{
          res.sendFile(__dirname + "/failure.html")
        }
      };
      run();   
});


app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT||3000, function(){
    console.log('server is running at');
});




