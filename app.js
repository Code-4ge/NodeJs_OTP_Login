// demo file from drive :D
const path = require('path');
const express = require("express");
const session = require('express-session');
const request = require('request');
const MySqlstore = require('express-mysql-session')(session);
const db = require(__dirname + '\\src\\db.js');

const app = express();
const port = 8000; 

app.set('view engine', 'ejs');

const staticPath = path.join(__dirname, '/views');
app.use(express.static(staticPath));
app.use(express.urlencoded({extended: true}));

var sessionOption = {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'bal'
}

var sessionStore = new MySqlstore(sessionOption);
app.use(session({
    secret: 'this is secret key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.get("/", (req, res)=>{
    res.render('index');
});

// API for checking ticket number
app.post("/api/ticket", (req, res)=>{
    var ticket = req.body.ticket;
    db.query(`SELECT * FROM l3 where Ticket_NO LIKE '${ticket}%'`, (err, result, field)=>{
        if(err)
            console.log(err);
        else{
            if(result == 0)
                res.json({msg:"wrong data"});
            else
                res.json({msg:"right data"});
        }
    })
});

// API for checking mobile number
app.post("/api/mobile", (req, res)=>{
    var mobile = req.body.mobile;
    db.query(`SELECT * FROM l3 where Phone_No LIKE '${mobile}%'`, (err, result, field)=>{
        if(err)
            console.log(err);
        else{
            if(result == 0)
                res.json({msg:"wrong data"});
            else
                res.json({msg:"right data"});
        }
    })
});

// API for sending OTP
app.post("/api/sendcode", (req, res)=>{
    var ticket = req.body.ticket;
    var mobile = req.body.mobile;
    db.query("SELECT * FROM l3 where Ticket_NO = ? AND Phone_No = ?", [ticket, mobile], (err, result, field)=>{
        if(err)
            console.log(err);
        else{
            if(result != 0)
            {
                console.log(result);
                var code = Math.floor(100000 + Math.random() * 900000);
                console.log(code);

                async function db_update(){
                    db.query("UPDATE l3 set OTP =? where Ticket_NO = ? AND Phone_No = ?",[code, ticket, mobile],(err, result)=>{
                        if(err){
                            console.log(err);
                        }
                        else
                            console.log(result);
                    } );
                }
                
                async function message(){
                    var phone = '+91'+mobile;
                    request(`http://digimate.airtel.in:15080/BULK_API/SendMessage?loginID=bajaj_htuser&password=bajaj@123&senderid=BAJAUT&DLT_TM_ID=1001096933494158&DLT_CT_ID=1107163091013020265&DLT_PE_ID=1101635620000025441&route_id=DLT_SERVICE_IMPLICT&Unicode=0&camp_name=bajaj_htuser&mobile=${phone}&text=Dear ${result[0].Name}, ${code} is the otp for logging into Ekam, valid for 5:00 min - Bajaj Auto Ltd.`, { json: true }, (err, res, body)=>{
                        if(err)
                            console.log(err);
                        else{
                            console.log(body);
                            // if(body == 'SUCCESS')
                            //     res.json({msg : 'send done'});
                            // else
                            //     res.json({msg : 'send fail'});
                        }
                    });

                }

                db_update();
                message();
                res.json({msg : 'send done'});
            }
            else
                res.json({msg:"send fail"});
        }
    })
});

// API for checking OTP
app.post("/api/checkcode", (req, res)=>{
    var ticket = req.body.ticket;
    var mobile = req.body.mobile;
    var code = req.body.code;
    db.query("SELECT * FROM l3 where Ticket_No = ? and Phone_No = ? and OTP = ?", [ticket, mobile, code], (err, result)=>{
        if(result != 0)
        {
            // if authenticated redirect to dashboard
            console.log('true');
            req.session.user = result[0].Ticket_No;
            console.log(req.session.user);
            res.json({msg: 'correct otp'});
        }
        else
        {
            console.log('false');
            res.json({msg : 'wrong otp'});
        }
    });
});

// dashboard route
app.get("/dashboard", (req, res)=>{
    // if(req.session.user)
    //     res.render('dashboard');
    // else{
    //     res.redirect('/');
    // }
    res.render('dashboard');
});

// logout route
app.get('/logout', (req, res)=>{
    if(req.session.user)
    {
        req.session.destroy();
        return res.redirect('/auth')
    }
    else
        return res.redirect('/')
})


// hosting server
app.listen(port, ()=>{
    console.log(`* Listing on http://127.0.0.1:${port}`);
});
