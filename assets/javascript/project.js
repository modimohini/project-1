var ingredients = ['thai', 'mexican', 'sushi', 'japanese', 'chinese', 'american', 'brewpub', 'froyo', 'pizza', 'italian']
console.log(ingredients)
var colors = ['#F06292', '#FFA726', '#FFEB3B', '#19F072', '#0CDADB']

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
var userCats = [];

var offset = "";

document.addEventListener('DOMContentLoaded', () => {
    const $geolocateButton = document.getElementById('spinToWin');
    $geolocateButton.addEventListener('click', geolocate);
})

function geolocate() {
    navigator.geolocation.getCurrentPosition(onGeolocateSuccess, onGeolocateError);
}


function onGeolocateSuccess(coordinates) {
    const {
        latitude,
        longitude
    } = coordinates.coords;
    console.log('Found coordinates: ', latitude, longitude);
}

function onGeolocateError(error) {
    console.warn(error.code, error.message);

    if (error.code === 1) {
        // they said no
    } else if (error.code === 2) {
        // position unavailable
    } else if (error.code === 3) {
        // timeout
    }
}

function getUserFavs() {
    userCats = localStorage.getItem("favRestArr");
}


function createWheel() {

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
    $(".gridSection").css("display", "block");
    index = 0;
    if (!isSpinning) {
        isSpinning = true;
        if (curActive != undefined) {
            $(".gridCell").css('background', 'white');
        }

    }
    isSpinning = true;
    $("#spinBtnCont").css("display", "none");
    doSlowdownThing();
}

function doSlowdownThing() {
    const timeoutDuration = pickATimeBasedOnIndex(index);
    changeBground();
    index++;

    if (index < 15) {
        setTimeout(doSlowdownThing, timeoutDuration);
    } else {
        isSpinning = false;
        $("#spinBtnCont").css("display", "block");
        $(".resResultsCont").css("display", "block");
        let ele = $("#cell" + prevActive);
        curActive = prevActive;
        prevActive = '';
        chosen = ele.text();
        console.log(chosen);
        searchYelp(chosen, '92121');
    }
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
    event.preventDefault();
    let ix = ingredients.indexOf($(this).text())
    ingredients.splice(ix, 1)
    console.log($(this).text())
    $('#btnsGoHere').empty()
    makeButtons()

}

function createIngredientBtn(ingredient) {

    //creates buttons with each ingredient in the array
    var makingIngredientBtn = document.createElement('button')
    makingIngredientBtn.textContent = ingredient

    //adding an attribute for the ajax call function
    $(makingIngredientBtn).attr("ing-data", ingredient)
    $(makingIngredientBtn).attr("data-position", "bottom")
    $(makingIngredientBtn).attr("data-tooltip", "add to wheel")
    // $(makingIngredientBtn).attr("class", "btn tooltipped")
    // $(makingIngredientBtn).attr("onclick", "{(e)=>{e.preventDefault()}}")


    //adds the materialize class to the button
    $(makingIngredientBtn).addClass("waves-effect waves-light btn-small teal lighten-2")

    //adds the materialize class to the button
    $(makingIngredientBtn).addClass("btn mCat waves-effect waves-light btn-small")
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

function addToIngredientsArray() {
    //clears out the input
    $('#btnsGoHere').empty()

}






$(document).ready(function () {

    var userZip = localStorage.getItem("resPickerZip");
    if (userZip != undefined && userZip != '') {
        $("#zipText").text(userZip);
    } else {
        userZip = Swal.fire({
            title: 'Enter your Zipcode to Search Local Restaurants',
            input: 'text',
            inputPlaceholder: 'Enter ZIPCode'
        }).then(function (result) {
            userzip = result.value;
            $("#zipText").text(result.value);
            localStorage.setItem("resPickerZip", result.value)
        })


        // swal({
        //     title: "Enter your Zipcode to Search Local Restaurants!",
        //     content: "input",
        //     buttons: [true, "Enter"],

        //   });

    }

    $('.collapsible').collapsible();
    $('.tooltipped').tooltip();
    getUserFavs();
    addToIngredientsArray()
    makeButtons()

    //searchYelp();

    //event listener
    $(document.body).on("click", "#spinToWin", spinItUp);
    $(document.body).on("click", ".mCat", removeIngredient);
    // $(document.body).on("click", "nextFive", nextFive);





    addingIngredient.addEventListener('click', function (event) {

        //keeps the page from clearing out when it refreshes
        event.preventDefault()

        //what happens when the button is click?
        //take the user input 

        //takes the user input and make it a value attribute so that we can use the attribute to call it when we need it
        var userInput = $('#userInput').val();
        // localStorage.setItem()
        $('#userInput').val("");
        //adds it to the array
        ingredients.push(userInput)
        createIngredientBtn(userInput)


    })
})

function searchYelp(cat, zip) {
    // JAVASCRIPT FOR FRONT-END CSS WIDGETS
    //let yelpSearch = "Thai";
    var api = "yKOEUCF9Lca7gsPDyifirt-pXKuwx_YIJvpiqO__oUJgJeKQWcNFkwUGpQs4nFxhofY5wI7VKbrXF-E4D5r-28x5BXv7QenKIbXAmKR9HJ5EPtfc4SVXWWqA_-evXHYx";
    //let location = Diego";
    let url = `https://api.yelp.com/v3/businesses/search?term=${cat}&location=${zip}&limit=12`

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
            var lat;
            var long;
            var reviewCount = 0;
            var phone = '';
            for (let i = 0; i < 5; i++) {
                $(divIdsName[i]).text("");
                $(divIds[i]).text("");
                var newCard = $("<div>")
                var infoCard = $("<div>")
                infoCard.attr('id', 'restaurantInfo')
                var name = results[i].name
                console.log(name);
                var id = results[i].id;


                var phone = results[i].display_phone
                const address1 = results[i].location.address1
                const address2 = results[i].location.address2
                const address3 = results[i].location.address3
                const address4 = results[i].location.city

                var location = address1 + address2;
                if (address3 != null) {
                    location += address3
                }
                location += '   ' + address4;

                searchYelpById(id)
                    .then(function (res) {
                        console.log(res)
                        console.log(res.review_count);
                        const photoOne = res.photos[0]
                        const photoTwo = res.photos[1]
                        const photoThree = res.photos[2]

                        var initialImageOne = $(`<img src=${photoOne}>`)
                        initialImageOne.attr('width', 380).attr('height', 300)
                        var initialImageTwo = $(`<img src=${photoTwo}>`)
                        initialImageTwo.attr('width', 380).attr('height', 300)
                        var initialImageThree = $(`<img src=${photoThree}>`)
                        initialImageThree.attr('width', 380).attr('height', 300)

                        var imageOne = $('<li>')
                        imageOne.append(initialImageOne)
                        var imageTwo = $('<li>')
                        imageTwo.append(initialImageTwo)
                        var imageThree = $('<li>')
                        imageThree.append(initialImageThree)

                        var carouselWheel = $("<div>")
                        carouselWheel.attr("class", "slider")
                        var sliderUl = $("<ul>")
                        sliderUl.attr("class", "slides")
                        carouselWheel.append(sliderUl)
                        sliderUl.append(imageOne)
                        sliderUl.append(imageTwo)
                        sliderUl.append(imageThree)
                        $('.slider').slider();
                        $(divIds[i]).prepend(carouselWheel)

                        var sundayStart = res.hours[0].open[0].start
                        var sundayEnd = res.hours[0].open[0].end

                        var mondayStart = res.hours[0].open[1].start
                        var mondayEnd = res.hours[0].open[1].end

                        var tuesdayStart = res.hours[0].open[2].start
                        var tuesdayEnd = res.hours[0].open[2].end

                        var wednesdayStart = res.hours[0].open[3].start
                        var wednesdayEnd = res.hours[0].open[3].end

                        var thursdayStart = res.hours[0].open[4].start
                        var thursdayEnd = res.hours[0].open[4].end

                        var fridayStart = res.hours[0].open[5].start
                        var fridayEnd = res.hours[0].open[5].end

                        var saturdayStart = res.hours[0].open[6].start
                        var saturdayEnd = res.hours[0].open[6].end

                        var pHours = $("<p>").text("Hours:")
                        var sundayHours = $("<p>").text("Sunday:" + " " + sundayStart + "-" + sundayEnd)
                        var mondayHours = $("<p>").text("Monday:" + " " + mondayStart + "-" + mondayEnd)
                        var tuesdayHours = $("<p>").text("Tuesday:" + " " + tuesdayStart + "-" + tuesdayEnd)
                        var wednesdayHours = $("<p>").text("Wednesday:" + " " + wednesdayStart + "-" + wednesdayEnd)
                        var thursdayHours = $("<p>").text("Thursday:" + " " + thursdayStart + "-" + thursdayEnd)
                        var fridayHours = $("<p>").text("Friday:" + " " + fridayStart + "-" + fridayEnd)
                        var saturdayHours = $("<p>").text("Saturday:" + " " + saturdayStart + "-" + saturdayEnd)

                        $(divIds[i]).append(pHours)
                        $(divIds[i]).append(sundayHours)
                        $(divIds[i]).append(mondayHours) 
                        $(divIds[i]).append(tuesdayHours) 
                        $(divIds[i]).append(wednesdayHours)
                        $(divIds[i]).append(thursdayHours) 
                        $(divIds[i]).append(fridayHours) 
                        $(divIds[i]).append(saturdayHours)
                        

                        reviewCount = res.review_count;
                        rating = res.rating;
                        console.log(name);
                        var p = $("<p>").text(results[i].name + " - Rated " + rating + " out of 5 with " + reviewCount + " Reviews");
                        $(divIdsName[i]).append(p)
                        var p2 = $("<p>").text(" (" + results[i].location.address1 + ", " + results[i].location.city + ")");
                        $(divIdsName[i]).append(p2)
                    })
                var price = results[i].price
                var open = results[i].is_closed
                var aliases = results[i].alias



                var p = $("<h5>").text(name);
                var searchImage = $("<img>")
                // searchImage.attr("src", results[i].image_url).attr('id', 'resultsIMG')
                // searchImage.attr('width', 380).attr('height', 300)
                var pSecondName = $("<p>").text(aliases);
                pSecondName.attr('id', 'alias')

                var pTwo = $("<p>").text("Location:  " + location);
                pTwo.attr('id', 'location')
                var pOne = $("<p>").text("Phone Number:  " + phone);
                pOne.attr('id', 'phoneNum')
                var pThree = $("<p>").text("Price:  " + price);
                pThree.attr('id', 'priceRange')
                var pFour = $("<p>")
                var pFour = $("<p>").text("Open: " + open)
                pFour.attr('id', 'hoursOfOp')
                // pFour.attr("src", urlAddress);

                newCard.append(searchImage)
                // infoCard.append(pSecondName)
                infoCard.append(pOne)
                infoCard.append(pTwo)
                infoCard.append(pThree);
                infoCard.append(pFour);
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

    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && $.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

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