let menu = document.querySelector("#menu-btn");
let navbar = document.querySelector(".navbar");
var main = document.querySelector(".main"),

    rate = document.getElementsByName("rate"),
    home = document.querySelector(".home");


//Animation


        
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

$(document).ready(function(){
    const allStar = document.querySelectorAll('.star-widget .star')
const ratingValue = document.querySelector('.star-widget input')
var header1 = document.querySelector(".form-header");

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
    
})


// For signup form validation
// $(document).ready(function(){
//     var loginmodal = document.getElementById('loginModal');
// var signupmodal = document.getElementById('signupModal');

// let loginclick = document.getElementById('login-link-su');
// loginclick.onclick = function() {
//     signupmodal.style.display = 'none';
//     loginmodal.style.display = 'block';

// }

// let signupclick = document.getElementById('signup-link-lg');
// signupclick.onclick = function() {
//     loginmodal.style.display = 'none';
//     signupmodal.style.display = 'block';
// }
// })
function Sign(event) {
    let email = document.querySelector("#email").value;
    let username = document.querySelector("#username").value;
    let role = document.querySelector("#role").value;
    let password = document.querySelector("#password").value;
    let confirm_password = document.querySelector("#confirm_password").value;

    let pwd_cond = document.querySelector(".password_condition");
    let username_warning = document.querySelector(".username_warning");
    let email_warn = document.querySelector(".email_warning");
    let role_warning = document.querySelector(".role_warning");
    let confirm_pwd_warn = document.querySelector(".confirm_pwd_warn");

    let user = '';
    let pass = '';
    let mail = '';
    let rolevalue = '';

    var reg_pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,}$/;
    var reg_mail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/;

    if (!reg_pwd.test(password)) {
        pwd_cond.innerHTML = "*Password condition is not satisfied";
        pwd_cond.style.display = 'block';
        pwd_cond.style.fontSize = '15px';
        event.preventDefault(); // Prevent form submission
    } else {
        pwd_cond.style.display = 'none';
    }

    if (!reg_mail.test(email)) {
        email_warn.innerHTML = "*Email is not valid";
        email_warn.style.display = 'block';
        email_warn.style.fontSize = '15px';
        event.preventDefault(); // Prevent form submission
    } else {
        mail = email;
        email_warn.style.display = 'none';
    }

    if (password !== confirm_password) {
        confirm_pwd_warn.innerHTML = "*Confirm password not matching";
        confirm_pwd_warn.style.display = 'block';
        event.preventDefault(); // Prevent form submission
    } else {
        pass = password;
        confirm_pwd_warn.style.display = 'none';
    }

    if (username === '') {
        username_warning.innerHTML = "*Enter Username";
        username_warning.style.display = 'block';
        event.preventDefault(); // Prevent form submission
    } else {
        user = username;
        username_warning.style.display = 'none';
    }

    if (role === '') {
        role_warning.innerHTML = "*Select Role";
        role_warning.style.display = 'block';
        event.preventDefault(); // Prevent form submission
    } else {
        rolevalue = role;
        role_warning.style.display = 'none';
    }
}



// const togglePassword = document.querySelectorAll('.pw_hide');

// togglePassword.forEach(toggle => {
//     toggle.addEventListener('click', function() {
//         const passwordInput = this.previousElementSibling;
//         if (passwordInput.type === 'password') {
//             passwordInput.type = 'text';
//         } else {
//             passwordInput.type = 'password';
//         }
//     });
// });


const packageWrapper = document.querySelector(".package-wrapper");
const packageCarousel = document.querySelector(".package-carousel");
const packageFirstCardWidth = packageCarousel.querySelector(".package-card").offsetWidth;
const packageArrowBtns = document.querySelectorAll(".package-wrapper i");
const packageCarouselChildrens = [...packageCarousel.children];

let packageIsDragging = false, packageIsAutoPlay = true, packageStartX, packageStartScrollLeft, packageTimeoutId;

let packageCardPerView = Math.round(packageCarousel.offsetWidth / packageFirstCardWidth);

packageCarouselChildrens.slice(-packageCardPerView).reverse().forEach(card => {
    packageCarousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

packageCarouselChildrens.slice(0, packageCardPerView).forEach(card => {
    packageCarousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

packageCarousel.classList.add("no-transition");
packageCarousel.scrollLeft = packageCarousel.offsetWidth;
packageCarousel.classList.remove("no-transition");

packageArrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        packageCarousel.scrollLeft += btn.id == "package-left" ? -packageFirstCardWidth : packageFirstCardWidth;
    });
});
const packageDragStart = (e) => {
    packageIsDragging = true;
    packageCarousel.classList.add("dragging");
    packageStartX = e.pageX;
    packageStartScrollLeft = packageCarousel.scrollLeft;
}

const packageDragging = (e) => {
    if(!packageIsDragging) return;
    packageCarousel.scrollLeft = packageStartScrollLeft - (e.pageX - packageStartX);
}

const packageDragStop = () => {
    packageIsDragging = false;
    packageCarousel.classList.remove("dragging");
}

const packageInfiniteScroll = () => {
    if(packageCarousel.scrollLeft === 0) {
        packageCarousel.classList.add("no-transition");
        packageCarousel.scrollLeft = packageCarousel.scrollWidth - (2 * packageCarousel.offsetWidth);
        packageCarousel.classList.remove("no-transition");
    }
    else if(Math.ceil(packageCarousel.scrollLeft) === packageCarousel.scrollWidth - packageCarousel.offsetWidth) {
        packageCarousel.classList.add("no-transition");
        packageCarousel.scrollLeft = packageCarousel.offsetWidth;
        packageCarousel.classList.remove("no-transition");
    }

    clearTimeout(packageTimeoutId);
    if(!packageWrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 80 || !packageIsAutoPlay) return; 
    packageTimeoutId = setTimeout(() => packageCarousel.scrollLeft += packageFirstCardWidth, 2500);
}
autoPlay();

packageCarousel.addEventListener("mousedown", packageDragStart);
packageCarousel.addEventListener("mousemove", packageDragging);
document.addEventListener("mouseup", packageDragStop);
packageCarousel.addEventListener("scroll", packageInfiniteScroll);
packageWrapper.addEventListener("mouseenter", () => clearTimeout(packageTimeoutId));
packageWrapper.addEventListener("mouseleave", autoPlay);


$(document).ready(function() {
    $('[repeat]').each(function() {
       var toRepeat = $(this).text();
       var times = parseInt($(this).attr('repeat'));
       var repeated = Array(times+1).join(toRepeat);
       $(this).text(repeated).removeAttr('repeat');
     });
   });//Footer
function sendEmail(){

    var params={
    from_name : document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    message: document.getElementById("message").value,
   };

   emailjs.send("service_ns4ekvp","template_gdvjcu8",params).then(function (res){
    
    alert("successfully sent!");
   })
   
 }