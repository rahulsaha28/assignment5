/***
 *  url1:  https://www.themealdb.com/api/json/v1/1/categories.php
 *  url2: https://www.themealdb.com/api/json/v1/1/lookup.php?i=52893
 * 
 *  meal id : mealData.allMeal[0].idMeal
 *  meal name: mealData.allMeal[0].strMeal
 *  meal img :mealData.allMeal[0].strMealThumb
 *  meal ingredient: mealData.specificMeal.strIngredient1
 *  meal ingredient value: mealData.specificMeal.strMeasure1
 * 
 * 
 */

// create a global meal obj
const mealData = {
    allMeal: null,
    searchMeal: null,
    specificMeal: null,
    mealIngredient: null
}





// when someone click the search button
document.getElementById("search-btn").addEventListener("click", function (event) {
    const searchInput = document.getElementById("search-box");
    if (searchInput.value) {
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchInput.value[0]}`;

        getSearchMeal(url, mealData, searchInput.value.toLowerCase());

        searchInput.value = null; // reset input value
        document.getElementById("error-message").innerHTML = ""; // reset error message 
        document.getElementById("specific-card").innerHTML = ""; // reset the specific card

    }

});

// when someone click in a card
document.getElementById("meal-card").addEventListener("click", function (event) {


    let specificMealId = event.target.parentElement.parentElement.dataset.id; // get specific card id 
    if (specificMealId != undefined) {

        getSingleCardInformation(specificMealId); // request api for specific card  
    }


});

// search by specific card id 
const getSingleCardInformation = (cardId) => {
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${cardId}`;
    apiCallForMeal(url, data => {
        mealData.specificMeal = data.meals[0];
        getIngredient(mealData.specificMeal);

    });
}


// get ingredient
const getIngredient = (meal) => {
    let ingredientName = Object.entries(meal).filter(pro => pro[0].includes("strIngredient")).filter(pro => pro[1] != "").filter(pro => pro[1] != null); // get ingredient Name
    let ingredientValue = Object.entries(meal).filter(pro => pro[0].includes("strMeasure"))
        .filter(pro => pro[1] != "")
        .filter(pro => pro[1] != null); // get ingredient value

    updateSingleIngredient(ingredientName, ingredientValue); // update ui for specific card

}

// update ui of a single card
const updateSingleIngredient = (ingredientName, ingredientValue) => {
    // create element
    document.getElementById("specific-card").innerHTML = `
    <div id="card-information" class="d-flex justify-content-center w-5 mt-3">
    <div class="card">
        <img id="card-icon" src=${mealData.specificMeal.strMealThumb} alt="" class="card-img-top">

        <div class="card-body">
            <h5 class="card-title">Ingredients</h5>
            <ul id="add-property">
               
            </ul>
        </div>
    </div>
    </div>
    `

    let mealQuality = document.getElementById("add-property");
    ingredientName.forEach((property, index) => {
        mealQuality.innerHTML += ` <li><i class="fas fa-check check"></i> ${ingredientValue[index][1]} ${property[1]}</li>`
    }); // add the feature of a meal


}


// search related meal
const getSearchMeal = (url, mealData, searchValue) => {

    apiCallForMeal(url, data => {

        mealData.allMeal = data.meals; // set the allMeal

        mealData.searchMeal = mealData.allMeal.filter(currentMeal =>
            !currentMeal.strMeal.toLowerCase().search(searchValue)
        ); // filter the data

        errorMessage(mealData.searchMeal) // set error message if present

        let mealCard = document.getElementById("meal-card");
        mealCard.innerHTML = ""; //reset the card

        mealData.searchMeal.forEach(meal => {
            mealCard.innerHTML += `<div class="col-md-3 col-sm-10" data-id=${meal.idMeal}>
            <div class="card"><img src="${meal.strMealThumb}" alt="" class="card-img-top rounded img-thumbnail"></div>
            <div class="card-body d-flex justify-content-center">
                <p>${meal.strMeal}</p>
            </div>
        </div>`
        }); // add the card  using  the search 

    });

}






// create an f for api call
const apiCallForMeal = (url, callBack) => {
    fetch(url)
        .then(res => res.json())
        .then(data => callBack(data))
        .catch(error => {
            errorMessage([]);
            document.getElementById("meal-card").innerHTML = "";
        });
}


// error message show function 
const errorMessage = (meals) => {
    if (meals.length == 0) {
        document.getElementById("error-message").innerHTML = `
             <div class="alert alert-danger" role="alert">
                No search meal present. Try again.
            </div>
        
        `
    }
    else {
        document.getElementById("error-message").innerHTML = "";
    }
}


