$(document).ready(function () {
    var ingredients = ['thai', 'mexican', 'sushi', 'japanese', 'chinese', 'american', 'brewpub', 'froyo', 'pizza', 'italian']
    console.log(ingredients)
    var colors = ['#F291BF', '#F2CB05 ', '#F2B705', '#F27405', '#F23005']

    var addingIngredient = document.getElementById("addBtn")
    var isSpinning = false;
    var searchArrLength = ingredients.length;
    var gridShown = false;
    var rotaterOne;
    var rotaterTwo;
    var prevActive;
    var curActive;
    var chosen;
    var index;
    var useCoords = false;
    var userLocation;
    var lat = '';
    var long = '';
    var userCats = [];
    var offset = 0;


    function promptZip(spinAfter) {
        Swal.fire({
            title: 'Enter your location (Zip, City, Etc) to Search Local Restaurants',
            input: 'text',
            inputPlaceholder: 'Enter ZIPCode'
        }).then(function (result) {
            // console.log(result);
            userLocation = result.value;
            if (userLocation != undefined && userLocation != '') {
                $("#zipText").text(result.value + " (Click to Update)");
                localStorage.setItem("resPickerZip", result.value)
                localStorage.setItem("isCoords", false);
                if (spinAfter) {
                    spinItUp();
                }
            } else {
                $("#zipText").text("Location not set");
            }
        })

    }
    function geolocate() {
        //if (userLocation == undefined || undefined == null) 
        navigator.geolocation.getCurrentPosition(onGeolocateSuccess, onGeolocateError);

    }


    function onGeolocateSuccess(coordinates) {
        const {
            latitude,
            longitude
        } = coordinates.coords;
        console.log('Found coordinates: ', latitude, longitude);
        userLocation = latitude + ',' + longitude;
        useCoords = true;
        localStorage.setItem("resPickerZip", userLocation);
        localStorage.setItem("isCoords", true);
        $("#zipText").text("Location Saved as Coordinates (Click to Update)");
        lat = latitude;
        long = longitude;

    }

    function onGeolocateError(error) {
        console.warn(error.code, error.message);
        useCoords = false;
        promptZip();
    }

    function getUserFavs() {
        let storedItem = localStorage.getItem("favRestArr");
        if (storedItem != '' && storedItem != undefined) {
            storedItem = JSON.parse(storedItem);

            storedItem.forEach(uItem => {
                addToIngredientsArray(uItem);
            });
        }
    }
    function addToIngredientsArray(item) {
        item = item.toLowerCase();
        if (ingredients.indexOf(item) == -1) {
            ingredients.push(item);
            createIngredientBtn(item)
        }
    }

    function createWheel() {
        //really, a grid. Creates table-grid, appends to panel, calls function to create light up animation that lands on a result, passes into api call. 
        $(".gridContainer").empty();
        let arrL = ingredients.length;

        let colMax = 3;
        let rowsNeeded = Math.ceil(arrL / colMax);
        console.log(arrL + " " + rowsNeeded)
        let rowCount = 0;
        let arrCounter = 0;
        let tbl = $("<table>");
        tbl.addClass = "gridTable";
        do {
            let numCells = 0;
            if (arrL < colMax) {
                numCells = arrL;
            } else {
                numCells = colMax;
            }

            let row = $("<tr>");
            row.addClass("gridRow");
            row.attr('data-rownum', rowCount);

            for (i = 0; i < numCells; i++) {
                let ele = $("<td>");
                ele.addClass("gridCell");
                ele.attr("id", "cell" + arrCounter)
                ele.text(ingredients[arrCounter]);
                ele.appendTo(row);
                arrCounter++;
                arrL--;

            }
            row.appendTo(tbl);
            rowCount++;

        } while (rowCount < rowsNeeded);

        tbl.appendTo(".gridContainer");
    }

    function spinItUp() {
      
        offset = 0;
       
        index = 0;
        if (!isSpinning) {
            isSpinning = true;
            if (curActive != undefined) {
                $(".gridCell").css('background', 'white');
            }

        }
        if (ingredients.length >1 || ingredients.length == undefined){
        $(".gridSection").css("display", "block");
        isSpinning = true;
        $("#spinBtnCont").css("display", "none");
        doSlowdownThing();
        } else {
        smallListCheck();
        }
    }

    function smallListCheck(){
        let len = ingredients.length;
        if (len==0){
            Swal.fire({
                title: "No categories to pick from!",
                text: "Add a category to the pool and then spin.",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK!'
            })
        } else if (len != undefined){
            chosen =ingredients[0];
            Swal.fire({
                title: "Only one category listed...",
                text: `Searching for ${ingredients[0]}`,
                type: 'info',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Sounds good!'
               
            }).then((result) => {
                $("#spinBtnCont").css("display", "block");
                $("#spinToWin").text("New Search");
                $(".resResultsCont").css("display", "block");
                $("#resTextLabel").text("Results for: " + chosen);
                searchYelp(chosen, userLocation, offset);
            })

        }
    }
    function doSlowdownThing() {
        const timeoutDuration = pickATimeBasedOnIndex(index);
        changeBground();
        index++;

        if (index < 15) {
            setTimeout(doSlowdownThing, timeoutDuration);
        } else {
            isSpinning = false;
            let ele = $("#cell" + prevActive);
            curActive = prevActive;
            prevActive = '';
            chosen = ele.text();
            console.log(chosen);
            acceptSpinCheck();

        }
    }

    function acceptSpinCheck() {
        Swal.fire({
            title: chosen.toUpperCase(),
            text: "You got " + chosen + "! Does that sound good or would you like to spin again?",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Show me the food!',
            cancelButtonText: 'SPIN AGAIN!!!'
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    'Looking up restaurants near your location!'

                )
                $("#spinBtnCont").css("display", "block");
                $("#spinToWin").text("Spin again?");
                $(".resResultsCont").css("display", "block");
                $("#resTextLabel").text("Results for: " + chosen);
                searchYelp(chosen, userLocation, offset);
            } else {
                spinItUp();
            }
        })
    }
    function searchNext() {

        offset = offset + 5;
        $("#lastFive").css("display", "inline-block");
        searchYelp(chosen, userLocation, offset);
    }

    function searchLast() {
        offset = offset - 5;
        if (offset == 0) {
            $("#lastFive").css("display", "none");
        }
        searchYelp(chosen, userLocation, offset);
    }
    function pickATimeBasedOnIndex() {
        if (index < 5) {
            return 175;
        } else if (index < 10) {
            return 250;
        } else if (index < 15) {
            return 400;
        } else {
            return 600;
        }

    }

    function changeBground() {

        let rando = Math.floor(Math.random() * ingredients.length);
        let colorRandom = Math.floor(Math.random() * colors.length);
        //const previousCell = `#cell${prevActive}t`;       
        $(".gridCell").css('background', 'white');

        if (rando == prevActive) {
            rando++;
            if (rando == ingredients.length) {
                rando = 0;
            }
        }

        prevActive = rando;
        rando = rando.toString();
        $(`#cell${rando}`).css('background', colors[colorRandom]);

    }

    function removeIngredient(event) {
        let ing = $(this).text()
        event.preventDefault();
        let ix = ingredients.indexOf(ing)
        ingredients.splice(ix, 1)
        // console.log(ing)
        $('#btnsGoHere').empty()
        removeFromLocal(ing);
        makeButtons();

    }
    function removeFromLocal(ingredient) {
        var check = localStorage.getItem("favRestArr");
        // console.log(check);
        if (check != null) {
            var parseCheck = JSON.parse(check);
            let ix = parseCheck.indexOf(ingredient);
            if (ix > -1) {
                parseCheck.splice(ix, 1);
                localStorage.setItem('favRestArr', JSON.stringify(parseCheck));
            }
        }
    }

    function createIngredientBtn(ingredient) {

        //creates buttons with each ingredient in the array
        var makingIngredientBtn = document.createElement('button')
        makingIngredientBtn.textContent = ingredient

        //adding an attribute for the ajax call function
        $(makingIngredientBtn).attr("ing-data", ingredient)
        // $(makingIngredientBtn).attr("data-position", "bottom")
        $(makingIngredientBtn).attr("id", "choiceBtn")
        $(makingIngredientBtn).attr("class", "btn tooltipped btn-flat mCat waves-light btn-medium")
        // $(makingIngredientBtn).attr("onclick", "{(e)=>{e.preventDefault()}}")

        //adds the materialize class to the button
        // $(makingIngredientBtn).addClass("btn-flat mCat waves-effect waves-light btn-small ")
        $(makingIngredientBtn).attr('data-tooltip', 'click to remove')
        $(makingIngredientBtn).attr('data-position', 'bottom')

        //append each item to buttonsDiv
        $('#btnsGoHere').append(makingIngredientBtn)
        createWheel();
    }

    function makeButtons() {
        $('#btnsGoHere').empty()
        //forEach loop to create a button for each item in the array
        //uses the create ingredient button function to make buttons for the items that are already in the array
        ingredients.forEach(createIngredientBtn)
        createWheel();
    }

    $(document).ready(function () {

        userLocation = localStorage.getItem("resPickerZip");
        // console.log(userLocation);
        useCoords = localStorage.getItem("isCoords");
        if (useCoords == undefined) {
            useCoords = false;
        }
        if (useCoords) {
            let coordSplit = userLocation.split(',');
            if (coordSplit[0] != undefined && coordSplit[1] != undefined) {
                lat = coordSplit[0];
                long = coordSplit[1];
                console.log(lat + ' ' + long);
            } else {
                useCoords = false;
            }
        }

        if (userLocation != undefined && userLocation != '' && !useCoords) {
            $("#zipText").text(userLocation + "(Click to Update)");
        } else if(userLocation != undefined && userLocation != '' && useCoords){
            $("#zipText").text("Location stored as Coordinates (Click to Update)");
        }else {
            userLocation = promptZip();
        }


        $('.collapsible').collapsible();
        $('.tooltipped').tooltip();
        makeButtons();
        getUserFavs();
     

        //event listeners
        $(document.body).on("click", "#spinToWin", function () {

            if (useCoords == false && (userLocation == undefined || userLocation == null || userLocation == "undefined")) {
                promptZip(true);
            } else {
                // console.log("Found Location " + userLocation);
                spinItUp();
            }
        });

        $(document.body).on("click", ".mCat", removeIngredient);
        $(document.body).on("click", "#nextFive", searchNext);
        $(document.body).on("click", "#lastFive", searchLast);

        $(document.body).on("click", "#zipText", function () {
            geolocate();
        });


        addingIngredient.addEventListener('click', function (event) {
            event.preventDefault()
            var userInput = $('#userInput').val();
            // localStorage.setItem()
            if (userInput != '') {
                $('#userInput').val("");
                //adds it to the array   
                addToUserFavorites(userInput);
                addToIngredientsArray(userInput);
            }

        })
    })
    function addToUserFavorites(item) {
        console.log(item);
        var check = localStorage.getItem("favRestArr");
        console.log(check);
        if (check != null) {
            var parseCheck = JSON.parse(check);
            console.log(parseCheck);
            // if (typeof parseCheck ==='object'){

            if (parseCheck.indexOf(item) == -1) {
                console.log("pushing to local");
                parseCheck.push(item);
                localStorage.setItem("favRestArr", JSON.stringify(parseCheck));
            }

        } else {
            let itemArr = [];
            itemArr.push(item);
            localStorage.setItem("favRestArr", JSON.stringify(itemArr));


        }

    }
    function searchYelp(cat, zip, offset) {
        // JAVASCRIPT FOR FRONT-END CSS WIDGETS
        //let yelpSearch = "Thai";
        if (zip == undefined || zip == '') {
            zip = 92121;
        }
        var api = "yKOEUCF9Lca7gsPDyifirt-pXKuwx_YIJvpiqO__oUJgJeKQWcNFkwUGpQs4nFxhofY5wI7VKbrXF-E4D5r-28x5BXv7QenKIbXAmKR9HJ5EPtfc4SVXWWqA_-evXHYx";
        //let location = Diego";
        if (useCoords) {
            var url = `https://api.yelp.com/v3/businesses/search?term=${cat}&latitude=${lat}&longitude=${long}&limit=5&offset=${offset}`
        } else {
            var url = `https://api.yelp.com/v3/businesses/search?term=${cat}&location=${zip}&limit=5&offset=${offset}`
        }

        console.log(url);
        $.ajaxPrefilter(function (options) {
            if (options.crossDomain && $.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        $.ajax(url, {
            headers: {
                "accept": "application/json",
                "x-requested-with": "xmlhttprequest",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${api}`
            }
        })
            .then(function (response) {
                const divIds = [
                    '#first',
                    '#second',
                    '#third',
                    '#fourth',
                    '#fifth'

                ]
                const divIdsName = [
                    '#firstName',
                    '#secondName',
                    '#thirdName',
                    '#fourthName',
                    '#fifthName'
                ]
                console.log(response);
                var results = response.businesses
                var rating = '';
                var reviewCount = 0;
                var phone = '';
                for (let i = 0; i < 5; i++) {
                    $(divIdsName[i]).text("");
                    $(divIds[i]).text("");
                    var newCard = $("<div>")
                    var infoCard = $("<div id='restaurantInfo" + i + "'>")
                    infoCard.attr('class', 'col s12 m12 l7')
                    var name = results[i].name
                    console.log(name);
                    var id = results[i].id;


                    var phone = results[i].display_phone
                    const address1 = results[i].location.address1
                    const address2 = results[i].location.address2
                    const address3 = results[i].location.address3
                    const address4 = results[i].location.city  
                    const distance = results[i].distance;
                    var milesFromLoc = distance * 0.00062137;
                    var disValid = false;
                    var mileP = $("<p>")
                    if (milesFromLoc != undefined && !isNaN(milesFromLoc)){
                        disValid = true;
                    milesFromLoc = parseFloat(milesFromLoc).toFixed(2);                    
                    mileP.text("Distance: " + milesFromLoc + " miles");
                    }

                    var location = address1;
                    if (address2 != null) {

                        location += " " + address2;
                    }
                    if (address3 != null) {
                        location += " " + address3
                    }
                    location = location.trim() + ', ' + address4;
                    var googleLink = "https://www.google.com/maps/dir/?api=1&destination=" + escape(location);
                    var price = results[i].price
                    //  var open = results[i].is_closed
                    //  if (!open){open =true}
                    var aliases = results[i].alias


                    var p = $("<h4>").text(name);
                    var searchImage = $("<img>")
                    // searchImage.attr("src", results[i].image_url).attr('id', 'resultsIMG')
                    // searchImage.attr('width', 380).attr('height', 300)
                    var pSecondName = $("<p>").text(aliases);
                    pSecondName.attr('id', 'alias')

                    var pTwo = $("<a>").attr("href", googleLink);
                    pTwo.attr('id', 'location').attr('class', 's12 m12')
                    pTwo.text(location);

                    var pOne = $("<p>").text("Phone Number:  " + phone);
                    pOne.attr('id', 'phoneNum')

                    var pThree = $("<p>").text("Price Range:  " + price);
                    pThree.attr('id', 'priceRange')


                    infoCard.append(pTwo)
                    infoCard.append(pOne)
                    infoCard.append(pThree);
                    if (disValid){
                        infoCard.append(mileP);
                    }
                    searchYelpById(id)
                        .then(function (res) {

                            const cardIndex = i;

                            let photoOne = res.photos[0]
                            let photoTwo = res.photos[1]
                            let photoThree = res.photos[2]

                            var initialImageOne = $(`<img src=${photoOne}>`)
                            initialImageOne.attr('width', 100).attr('height', 100).attr('class', 'responsive-img s12')
                            var initialImageTwo = $(`<img src=${photoTwo}>`)
                            initialImageTwo.attr('width', 100).attr('height', 100).attr('class', 'responsive-img s12')
                            var initialImageThree = $(`<img src=${photoThree}>`)
                            initialImageThree.attr('width', 100).attr('height', 100).attr('class', 'responsive-img s12')

                            var imageOne = $('<li>')
                            imageOne.append(initialImageOne)
                            var imageTwo = $('<li>')
                            imageTwo.append(initialImageTwo)
                            var imageThree = $('<li>')
                            imageThree.append(initialImageThree)

                            var carouselWheel = $("<div>")
                            carouselWheel.attr("class", "slider col s12 l5")
                            carouselWheel.attr("id", "caro"+cardIndex)
                            var sliderUl = $("<ul>")
                            sliderUl.attr("class", "slides")
                            sliderUl.append(imageOne)
                            sliderUl.append(imageTwo)
                            sliderUl.append(imageThree)
                            carouselWheel.append(sliderUl)
                            $(divIds[i]).prepend(carouselWheel)
                            $(`#caro${cardIndex}`).slider();
                            // var hours = res.hours[0];
                            var resHours = processHours(res.hours[0].open);
                            var dayArray = ["Monday", 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                            var hourString = '<h6>Hours: </h6>';
                            for (let z = 0; z < resHours.length; z++) {
                                let dayHours = resHours[z];
                                if (dayHours == "CLOSED") {
                                    hourString += `<p>${dayArray[z]}: CLOSED</p>`
                                } else if (dayHours.length == 1) {
                                    hourString += `<p>${dayArray[z]}: ${dayHours}</p>`
                                } else if (dayHours.length > 1) {
                                    hourString += `<p>${dayArray[z]}: ${dayHours}</p>`
                                } else {
                                    hourString += `<p>${dayArray[z]}: Hours unavailable...</p>`
                                }
                            }


                            const infoCard = $('#restaurantInfo' + cardIndex);

                            infoCard.append('<div>' + hourString + '</div>');
                            console.log(infoCard)
                            console.log($(hourString));
                            reviewCount = res.review_count;
                            rating = res.rating;
                            var p = $("<h6>").text(results[i].name + " - Rated " + rating + " out of 5 with " + reviewCount + " Reviews");
                            $(divIdsName[i]).append(p)
                            var p2 = $("<h7>").text(" (" + results[i].location.address1 + ", " + results[i].location.city + ")");
                            $(divIdsName[i]).append(p2)
                        })

                    $(divIds[i]).append(newCard)
                    $(divIds[i]).append(infoCard)
                    // $(divIdsName[i]).append(p)
                }
            });
    }

    function searchYelpById(id) {

        var api = "yKOEUCF9Lca7gsPDyifirt-pXKuwx_YIJvpiqO__oUJgJeKQWcNFkwUGpQs4nFxhofY5wI7VKbrXF-E4D5r-28x5BXv7QenKIbXAmKR9HJ5EPtfc4SVXWWqA_-evXHYx";
        // let location = "San Diego";
        let url = `https://api.yelp.com/v3/businesses/${id}`

        return $.ajax(url, {
            headers: {
                "accept": "application/json",
                "x-requested-with": "xmlhttprequest",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${api}`
            }
        })
            .then(function (response) {
                return response;
            })
    }

    // ------------------------------------------------------------------------------------------------------------

    function processHours(hoursArr) {
        //hoursArr is a variable length array of objects. May be more than one object per day (assume sequentially ordered), and may be no object for
        let week = [0, 1, 2, 3, 4, 5, 6];

        for (i = 0; i < week.length; i++) {
            let tempArr = [];
            let res = '';
            for (let index = 0; index < hoursArr.length; index++) {
                const element = hoursArr[index];

                if (hoursArr[index].day == i) {
                    let s = convertMilitary(hoursArr[index].start);
                    //    console.log(s);
                    tempArr.push(s + ' - ' + convertMilitary(hoursArr[index].end));
                }

            }
            if (tempArr.length == 0) {
                res = "CLOSED";
            } else {
                res = tempArr;
            }
            week.splice(i, 1, res);
        }
        return week;
    }


    function convertMilitary(time) {

        var hours = time.substring(0, 2);
        var minutes = time.substring(3, 5);

        var timeValue;

        if (hours > 0 && hours <= 12) {
            timeValue = "" + hours;
        } else if (hours > 12) {
            timeValue = "" + (hours - 12);
        } else if (hours == 0) {
            timeValue = "12";
        }

        timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
        timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
        // console.log(timeValue);
        return timeValue;
    }
})