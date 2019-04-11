

var ingredients = ['tequila', 'gin', 'vodka', 'whiskey', 'orange juice', 'lime', 'cranberry juice','tonic','rum']
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

    do {
        let numCells = 0;
        if (arrL < colMax) {
            numCells = arrL;
        } else {
            numCells = colMax;
        }
        console.log(numCells);
        let row = $("<div>");
        row.addClass("gridRow");
        row.attr('data-rownum', rowCount);

        for (i = 0; i < numCells; i++) {
            let ele = $("<div>");
            ele.addClass("gridCell");
            ele.text(ingredients[arrCounter]);
            ele.appendTo(row);
            arrCounter++;
            arrL--;
            console.log(arrCounter + " " + arrL);
        }
        row.appendTo(".gridContainer");
        rowCount++;

    } while (rowCount < rowsNeeded);

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





function searchDrink(ingredient) {
    var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        //todo write out response
        console.log(response)
    });

}





$(document).ready(function () {

    addToIngredientsArray()
    makeButtons()
    createWheel();
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
        var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient

        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            //todo write out response
            console.log(response)
        });

    }

})

// JAVASCRIPT FOR FRONT-END CSS WIDGETS

$(document).ready(function(){
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip();
  });
// ------------------------------------------------------------------------------------------------------------

