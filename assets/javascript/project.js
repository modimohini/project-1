var ingredients = ['tequila', 'gin', 'vodka', 'whiskey', 'orange juice', 'lime', 'cranberry juice', 'tonic', 'rum']
console.log(ingredients)

var addingIngredient = document.getElementById("addBtn")



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
        console.log(numCells);
        let row = $("<tr>");
        row.addClass("gridRow");
        row.attr('data-rownum', rowCount);

        for (i = 0; i < numCells; i++) {
            let ele = $("<td>");
            ele.addClass("gridCell");
            ele.text(ingredients[arrCounter]);
            ele.appendTo(row);
            arrCounter++;
            arrL--;
            console.log(arrCounter + " " + arrL);
        }
        row.appendTo(tbl);
        rowCount++;

    } while (rowCount < rowsNeeded);

    tbl.appendTo(".gridContainer");
}




function createIngredientBtn(ingredient) {

    //creates buttons with each ingredient in the array
    var makingIngredientBtn = document.createElement('button')
    makingIngredientBtn.textContent = ingredient

    //adding an attribute for the ajax call function
    $(makingIngredientBtn).attr("ing-data", ingredient)
    $(makingIngredientBtn).attr("data-position", "bottom")
    $(makingIngredientBtn).attr("data-tooltip", "add to wheel")
    $(makingIngredientBtn).attr("class", "btn tooltipped")


    //adds the materialize class to the button
    $(makingIngredientBtn).addClass("waves-effect waves-light btn-small")

    //append each item to buttonsDiv
    $('#btnsGoHere').append(makingIngredientBtn)
    createWheel();
}

function makeButtons() {
    $('#btnsGoHere').empty()
    //forEach loop to create a button for each item in the array
    //uses the create ingredient button function to make buttons for the items that are already in the array
    ingredients.forEach(createIngredientBtn)

}

function addToIngredientsArray() {
    //clears out the input
    $('#btnsGoHere').empty()

}







$(document).ready(function () {
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip();
    addToIngredientsArray()
    makeButtons()
    searchYelp();
    searchDrink()
    // createWheel();
    //event listener
    addingIngredient.addEventListener('click', function (event) {

        //keeps the page from clearing out when it refreshes
        event.preventDefault()

        //what happens when the button is click?
        //take the user input 

        //takes the user input and make it a value attribute so that we can use the attribute to call it when we need it
        var userInput = $('#userInput').val();

        //adds it to the array
        ingredients.push(userInput)
        createIngredientBtn(userInput)
        console.log(ingredients)

    })

    function searchDrink(ingredient) {
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            var results = response.data
            for (let i = 0; i < 5; i++) {


                // var newCard = $("<div>")
                // var name = results[i].strDrink
                // var p = $("<p>").text("Drink Name  " + name);
                // var searchImage = $("<img>");
                // searchImage.attr("src", results[i].strDrinkThumb);
                // newCard.prepend(p);
                // newCard.prepend(searchImage);
                // newCard.attr('id', new_id)
            }
            console.log(response)
        });
    }

})

// JAVASCRIPT FOR FRONT-END CSS WIDGETS
function searchYelp() {
    let yelpSearch = "Thai";
    var api = "yKOEUCF9Lca7gsPDyifirt-pXKuwx_YIJvpiqO__oUJgJeKQWcNFkwUGpQs4nFxhofY5wI7VKbrXF-E4D5r-28x5BXv7QenKIbXAmKR9HJ5EPtfc4SVXWWqA_-evXHYx";
    let location = "San Diego";
    let url = `https://api.yelp.com/v3/businesses/search?term=${yelpSearch}&location=${location}&limit=12`

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
            console.log(response);
            var results = response.businesses
            for (let i = 0; i < 5; i++) {
                var newCard = $("<div>")
                var name = results[i].name
                var phone = results[i].display_phone
                const address1 = results[i].location.address1
                const address2 = results[i].location.address2
                const address3 = results[i].location.address3
                const address4 = results[i].location.city

                var location = address1 + address2 + address3 + '   ' + address4
                var price = results[i].price
                var open = results[i].is_closed
                var aliases = results[i].alias
                
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

                var p = $("<p>").text(name);
                var searchImage = $("<img>")
                searchImage.attr("src", results[i].image_url)
                searchImage.attr('width', 380).attr('height', 300)
                var pSecondName = $("<p>").text(aliases);
                var pOne = $("<p>").text("Phone Number:  " + phone);
                var pTwo = $("<p>").text("Location:  " + location);
                var pThree = $("<p>").text("Price:  " + price);
                var pFour = $("<p>")
                var pFour = $("<p>").text("Open: " + open)
                // pFour.attr("src", urlAddress);
  
                newCard.append(searchImage)
                newCard.append(pSecondName)
                newCard.append(pOne)
                newCard.append(pTwo)
                newCard.append(pThree);
                newCard.append(pFour);
                $(divIds[i]).append(newCard)
                $(divIdsName[i]).append(p)








            }
        });
}




// ------------------------------------------------------------------------------------------------------------