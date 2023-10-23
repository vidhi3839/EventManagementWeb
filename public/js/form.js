window.addEventListener("load", () => {

    //image upload

    const dropArea = document.querySelector("#drop-area"),
        imageView = document.querySelector(".img-view"),
        image = document.querySelector("#image");

    image.addEventListener("change", function (e) {
        let imgLink = URL.createObjectURL(image.files[0]);
        imageView.style.backgroundImage = `url(${imgLink})`;
        imageView.textContent = "";
        imageView.style.border = 0;
    })
    dropArea.addEventListener("dragover", function (e) {
        e.preventDefault();
    });
    dropArea.addEventListener("drop", function (e) {
        e.preventDefault();
        image.files = e.dataTransfer.files;

        image.addEventListener("change", function (e) {
            let imgLink = URL.createObjectURL(image.files[0]);
            imageView.style.backgroundImage = `url(${imgLink})`;
            imageView.textContent = "";
            imageView.style.border = 0;
        })
    });

    //add more input fields for services

    let addMoreServicesBtn = document.querySelector("#add-more-services");
    let addMoreServicesList = document.querySelector('.add-more-services-list');
    let addMoreServicesDiv = document.querySelectorAll('.add-more-services-div')[0];

    addMoreServicesBtn.addEventListener('click', function () {
        let newHalls = addMoreServicesDiv.cloneNode(true);
        let input = newHalls.getElementsByTagName('input')[0];
        input.value = '';
        addMoreServicesList.appendChild(newHalls);
    });


    //add more input field for halls/packages prices

    
    let addMoreButton = document.querySelector("#add-more-button");
    let addMore = document.querySelector('.add-more');
    let addMoreDivision = document.querySelectorAll('.add-more-division')[0];

    addMoreButton.addEventListener('click', function () {
        let newItem = addMoreDivision.cloneNode(true);
        let input = newItem.getElementsByTagName('input');
        for(let i=0; i< input.length; i++){
            input[i].value = '';}
        addMore.appendChild(newItem);
    });

    
    //add more input field for food prices

    
    let addMoreFoodButton = document.querySelector("#add-food-button");
    let addMoreFood = document.querySelector('.add-more-food');
    let addMoreFoodDivision = document.querySelectorAll('.add-more-food-division')[0];

    addMoreFoodButton.addEventListener('click', function () {
        let newItem = addMoreFoodDivision.cloneNode(true);
        let input = newItem.getElementsByTagName('input');
        for(let i=0; i< input.length; i++){
        input[i].value = '';}
        addMoreFood.appendChild(newItem);
    });


    
    //add more input field for event decor prices

    
    let addMoreDecorButton = document.querySelector("#add-more-decor-button");
    let addMoreDecor = document.querySelector('.add-more-decor-price');
    let addMoreDecorDivision = document.querySelectorAll('.add-more-decor-division')[0];

    addMoreDecorButton.addEventListener('click', function () {
        let newItem = addMoreDecorDivision.cloneNode(true);
        let input = newItem.getElementsByTagName('input');
        for(let i=0; i< input.length; i++){
            input[i].value = '';}
        addMoreDecor.appendChild(newItem);
    });

      
    //add more input field for room prices

    
    let addMoreRoomButton = document.querySelector("#add-more-room-button");
    let addMoreRoom = document.querySelector('.add-more-room-price');
    let addMoreRoomDivision = document.querySelectorAll('.add-more-room-division')[0];

    addMoreRoomButton.addEventListener('click', function () {
        let newItem = addMoreRoomDivision.cloneNode(true);
        let input = newItem.getElementsByTagName('input');
        for(let i=0; i< input.length; i++){
            input[i].value = '';}
        addMoreRoom.appendChild(newItem);
    });


})
