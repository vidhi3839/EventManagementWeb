let menu = document.querySelector("#menu-btn"),
navbar = document.querySelector(".navbar");
var main = document.querySelector(".main"),

    rate = document.getElementsByName("rate"),
    header1 = document.querySelector(".form-header"),
    home = document.querySelector(".home"),
    formContent = document.querySelector(".form-content"),
    formClose = document.querySelector(".form-close"),
    login = document.querySelector("#login"),
    signup = document.querySelector("#signup"),
    signup1 = document.querySelector("#signup1"),
    pwdShowHide = document.querySelectorAll(".pw_hide");


const allStar = document.querySelectorAll('.star-widget .star')
const ratingValue = document.querySelector('.star-widget input')

// For navigation bar 

function navBarToggle(){
    menu.classList.toggle('fa-window-close');
    navbar.classList.toggle('navbar-active');
    navbar.classList.toggle('navigation-bar')
}


// For Home 

$(document).ready(function() {
    $("#logo").animate({
        opacity:'1'
    },1500);

var text = "We turn your dreams into beautiful reality !!";
var tag = document.getElementById("tag");
var i = 0;

function type() {
    if (i < text.length) {
        tag.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, 30); // Delay before typing the next character
    }
}

type();
});

// For rating

allStar.forEach((item, idx) => {
    item.addEventListener('click', function () {
        let click = 0
        ratingValue.value = idx + 1

        allStar.forEach(i => {
            i.classList.remove('star-solid')
            i.classList.remove('active')
        })
        for (let i = 0; i <= allStar.length; i++) {
            allStar[i].classList.remove('rate-5')
            if (i <= idx) {
                allStar[i].classList.add('star-solid')
                allStar[i].classList.add('active')
                allStar[i].classList.add('rate-5')
                if (i == 0)
                    header1.innerHTML = "I hate it 🤮";
                if (i == 1)
                    header1.innerHTML = "I dont like it 😒";
                if (i == 2)
                    header1.innerHTML = "I just like it 😄";
                if (i == 3)
                    header1.innerHTML = "It is awesome 😎";
                if (i == 4)
                    header1.innerHTML = "I love it 😍";

            } else {
                allStar[i].style.setProperty('--i', click)
                click++
            }
        }
    })
})

// For signup form validation

pwdShowHide.forEach((icon) => {
    icon.addEventListener("click", () => {
        let getPwdInput = icon.parentElement.querySelector("input");
        if (getPwdInput.type == "password") {
            getPwdInput.type = "text";
            icon.classList.replace("fa-eye-slash", "fa-eye")
        }
        else {
            getPwdInput.type = "password"
            icon.classList.replace("fa-eye", "fa-eye-slash")
        }
    })
});

function Sign() {
    let email = document.querySelector("#email").value,
        password = document.querySelector("#password").value,
        confirm_password = document.querySelector("#confirm_password").value,
        signedin = document.querySelector("#signed_in"),
        pwd_cond = document.querySelector(".password_condition"),
        email_warn = document.querySelector(".email_warning"),
        confirm_pwd_warn = document.querySelector(".confirm_pwd_warn");

    var reg_pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,}$/,
        reg_mail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/

    if (reg_pwd.test(password)) {
        signedin.style.display = 'block'
    }
    else {
        pwd_cond.innerHTML = "*Password condition is not satisfied";
        pwd_cond.style.fontSize = '15px'
    }

    if (reg_mail.test(email)) { signedin.style.display = 'block' }
    else {
        email_warn.innerHTML = "*Email is not valid"
        email_warn.style.display = 'block'
        email_warn.style.fontSize = '15px'
    }

    if (password == confirm_password) {
        signedin.style.display = 'block'
    }
    else {
        confirm_pwd_warn.innerHTML = "*Confirm password not matching"
    }
}

