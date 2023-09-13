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
const packageWrapper = document.querySelector(".package-wrapper");
const packageCarousel = document.querySelector(".package-carousel");
const packageFirstCardWidth = packageCarousel.querySelector(".package-card").offsetWidth;
const packageArrowBtns = document.querySelectorAll(".package-wrapper i");
const packageCarouselChildrens = [...packageCarousel.children];

let packageIsDragging = false, packageIsAutoPlay = true, packageStartX, packageStartScrollLeft, packageTimeoutId;

// Get the number of cards that can fit in the carousel at once
let packageCardPerView = Math.round(packageCarousel.offsetWidth / packageFirstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
packageCarouselChildrens.slice(-packageCardPerView).reverse().forEach(card => {
    packageCarousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
packageCarouselChildrens.slice(0, packageCardPerView).forEach(card => {
    packageCarousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
packageCarousel.classList.add("no-transition");
packageCarousel.scrollLeft = packageCarousel.offsetWidth;
packageCarousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
packageArrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        packageCarousel.scrollLeft += btn.id == "package-left" ? -packageFirstCardWidth : packageFirstCardWidth;
    });
});
const packageDragStart = (e) => {
    packageIsDragging = true;
    packageCarousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    packageStartX = e.pageX;
    packageStartScrollLeft = packageCarousel.scrollLeft;
}

const packageDragging = (e) => {
    if(!packageIsDragging) return; // if packageIsDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    packageCarousel.scrollLeft = packageStartScrollLeft - (e.pageX - packageStartX);
}

const packageDragStop = () => {
    packageIsDragging = false;
    packageCarousel.classList.remove("dragging");
}

const packageInfiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(packageCarousel.scrollLeft === 0) {
        packageCarousel.classList.add("no-transition");
        packageCarousel.scrollLeft = packageCarousel.scrollWidth - (2 * packageCarousel.offsetWidth);
        packageCarousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(packageCarousel.scrollLeft) === packageCarousel.scrollWidth - packageCarousel.offsetWidth) {
        packageCarousel.classList.add("no-transition");
        packageCarousel.scrollLeft = packageCarousel.offsetWidth;
        packageCarousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(packageTimeoutId);
    if(!packageWrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 80 || !packageIsAutoPlay) return; // Return if window is smaller than 800 or packageIsAutoPlay is false
    // Autoplay the carousel after every 2500 ms
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
    $("a").click(function(event) {
      var $this = $(this),
        url = $this.data("url");

      $(document.body).load(url);
      event.preventDefault();
    });
  });
