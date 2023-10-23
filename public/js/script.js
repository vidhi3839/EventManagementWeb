let menu = document.querySelector("#menu-btn"),
navbar = document.querySelector(".navbar");
var main = document.querySelector(".main"),

    rate = document.getElementsByName("rate"),
    home = document.querySelector(".home");


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


