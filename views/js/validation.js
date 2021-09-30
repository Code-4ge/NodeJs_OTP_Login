// Non-L3+ form variables
const form1 = {
    ticket : document.getElementById('ticket-nonl3'),
    mobile : document.getElementById('phone-nonl3'),
    submit : document.getElementById('nonl3-btn'),
    t_right : document.getElementById('correct1'),
    t_wrong : document.getElementById('wrong1'),
    m_right : document.getElementById('correct2'),
    m_wrong : document.getElementById('wrong2'),
    nonl3_otp : document.getElementById('nonl3-otp'),
    check_code : document.getElementById('check-otp'),
    code : document.getElementById('code'),
    err_msg : document.getElementById('error-message'),
    err : document.getElementById('error'),
    progress : document.getElementById('prog'),
    progress_bar : document.getElementById('p-bar')
}

// L3+ form variables
const form2 = {
    ticket : document.getElementById('ticket-l3'),
    mobile : document.getElementById('phone-l3'),
    submit : document.getElementById('l3-btn')
}

// keyup EventListener for ticket
form1.ticket.addEventListener('keyup', ()=>{
    if(form1.ticket.value.length != 0)
    {
        if(!(isNaN(form1.ticket.value)))
        {
            const reqData = `ticket=${form1.ticket.value}`;
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/ticket');
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(reqData);

            xhr.onload = () => {
                let responseObject = null;
                try{
                    responseObject = JSON.parse(xhr.responseText);
                    console.log(responseObject.msg);
                    if(responseObject.msg == 'right data')
                    {
                        form1.t_right.style.display = 'block';
                        form1.t_wrong.style.display = 'none';
                    }
                    if(responseObject.msg == 'wrong data')
                    {
                        form1.t_right.style.display = 'none';
                        form1.t_wrong.style.display = 'block';
                    }
                }
                catch(e){
                    console.log('could not found JSON response');
                }
            }
        }
        else{
            form1.t_right.style.display = 'none';
            form1.t_wrong.style.display = 'block';
        }
    }
    else{
        form1.t_right.style.display = 'none';
        form1.t_wrong.style.display = 'none';
    }
});

// mobile EventListener for mobile
form1.mobile.addEventListener('keyup', ()=>{
    if(form1.mobile.value.length != 0)
    {
        if(!(isNaN(form1.mobile.value)) && form1.mobile.value.length <= 10)
        {
            const reqData = `mobile=${form1.mobile.value}`;
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/mobile');
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(reqData);

            xhr.onload = () => {
                let responseObject = null;
                try{
                    responseObject = JSON.parse(xhr.responseText);
                    console.log(responseObject.msg);
                    if(responseObject.msg == 'right data')
                    {
                        form1.m_right.style.display = 'block';
                        form1.m_wrong.style.display = 'none';
                        if(form1.mobile.value.length == 10)
                        {
                            form1.submit.disabled = false; 
                            form1.submit.style.backgroundColor = '#fe0aa7';
                            form1.submit.style.color = 'white';
                        }
                        else{
                            form1.submit.disabled = true;
                            form1.submit.style.backgroundColor = '#bbb9ba';
                            form1.submit.style.color = 'white';
                        }
                    }
                    if(responseObject.msg == 'wrong data')
                    {
                        form1.m_right.style.display = 'none';
                        form1.m_wrong.style.display = 'block';
                        form1.submit.disabled = true;
                        form1.submit.style.backgroundColor = '#bbb9ba';
                        form1.submit.style.color = 'white';
                    }
                }
                catch(e){
                    console.log('error in JSON response');
                }
            }
        }
        else{
            form1.m_right.style.display = 'none';
            form1.m_wrong.style.display = 'block';
            form1.submit.disabled = true;
            form1.submit.style.backgroundColor = '#bbb9ba';
            form1.submit.style.color = 'white';
        }
    }
    else{
        form1.m_right.style.display = 'none';
        form1.m_wrong.style.display = 'none';
        form1.submit.disabled = true;
        form1.submit.style.backgroundColor = '#bbb9ba';
        form1.submit.style.color = 'white';
    }
});

// click EventListener for form submiting
form1.submit.addEventListener('click', ()=>{
        const reqData = `ticket=${form1.ticket.value}&mobile=${form1.mobile.value}`;
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/sendcode');
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(reqData);

        xhr.onload = () => {
            let responseObject = null;
            try{
                responseObject = JSON.parse(xhr.responseText);
                console.log(responseObject.msg);
                if(responseObject.msg == 'send done')
                {
                    form1.err_msg.innerHTML = "";
                    form1.err.style.display = 'none';
                    form1.nonl3_otp.style.setProperty('display', 'block', 'important');
                    form1.code.value = '';
                        
                    async function time(timeleft, timetotal, element){
                        element.innerHTML = (Math.floor(timeleft/60) + ":"+ timeleft%60);
                        if(timeleft > 0) {
                            setTimeout(function() {
                                time(timeleft - 1, timetotal, element);
                            }, 1000);
                        };
                    }
                    time(60, 60, document.getElementById('timer'));
                        
                    var progressBar = new ProgressBar.Circle('#progress', {
                                            strokeWidth: 10,
                                            duration: 60000,                     // milliseconds
                                            trailColor: '#727272',
                                            trailWidth: 2,
                                            easing: 'linear',
                                            from: { color: '#00FF00' },
                                            to: { color: '#FF0000' },
                                            step: function(state, circle, attachment) {
                                                circle.path.setAttribute('stroke', state.color);
                                            },
                    });
                    
                    progressBar.animate(1.0);                            // percent
                }
                else
                {
                    form1.err_msg.innerHTML = "<li>Ticket No. and Phone No. combination doesn't match</li>";
                    form1.err.style.display = 'block';
                    form1.nonl3_otp.style.display = 'none';
                }
            }
            catch(e){
                console.log('error in JSON response');
            }
        }
});

// click EventListener for submiting code
form1.check_code.addEventListener('click', ()=>{
    const reqData = `ticket=${form1.ticket.value}&mobile=${form1.mobile.value}&code=${form1.code.value}`;
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/checkcode');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(reqData);

    xhr.onload = () => {
        let responseObject = null;
        try{
            responseObject = JSON.parse(xhr.responseText);
            console.log(responseObject.msg);
            if(responseObject.msg == 'correct otp')
            {
                // redirect to dashboard...
                window.open("/dashboard", '_self');
            }
            else
            {
                form1.err_msg.innerHTML = "<li>Entered OTP/Code is Wrong, Please click on 'Send Code' to Re-send</li>";
                form1.err.style.display = 'block';
                form1.nonl3_otp.style.display = 'none';
            }
        }   
        catch(e){
            console.log('error in JSON response');
        }
    }
});

