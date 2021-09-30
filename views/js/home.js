check1 = document.getElementById('l3-check');
check1.checked = true;
check2 = document.getElementById('nonl3-check');

l3_btn = document.getElementById('l3');
nonl3_btn = document.getElementById('non-l3');

l3_form = document.getElementById('l3-form');
nonl3_form = document.getElementById('nonl3-form')

function check_box(){
    if(check1.checked == true)
    {
        nonl3_form.style.display = 'flex';
        l3_form.style.display = 'none';
        l3_btn.style.borderWidth = '2px';
        l3_btn.style.borderColor = 'purple';
        nonl3_btn.style.borderWidth = '1px';
        nonl3_btn.style.borderColor = 'gray';
    }
    if(check2.checked == true)
    {
        nonl3_form.style.display = 'none';
        l3_form.style.display = 'flex'
        nonl3_btn.style.borderWidth = '2px';
        nonl3_btn.style.borderColor = 'purple';
        l3_btn.style.borderWidth = '1px';
        l3_btn.style.borderColor = 'gray';
    }
}

function checkl3(){
    check1.checked = true;
    check2.checked = false;
    check_box()
}

function checknonl3(){
    check2.checked = true;
    check1.checked = false;
    check_box()
}

check_box()