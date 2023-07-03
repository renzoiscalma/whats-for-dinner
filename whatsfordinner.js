window.addEventListener("DOMContentLoaded", (event) => {
  let checkedIngredients = new Set();

  function toggleIngredient(checkboxContainer) {
    toggleCheckbox(checkboxContainer);
    updateIngredientsList(checkboxContainer);
  }

  function toggleCheckbox(checkboxContainer) {
    let checkbox = checkboxContainer.childNodes[1];
    // toggle checkbox
    checkbox.checked = !checkbox.checked;
  }

  function updateIngredientsList(checkboxContainer) {
    // add to ingredients list
    let ingredient = checkboxContainer.children[2].innerText;
    let checkbox = checkboxContainer.childNodes[1];

    if (checkbox.checked) {
      addNewIngredient(ingredient);
    } else {
      removeIngredientFromList(ingredient);
    }
  }

  function addNewIngredient(ingredient) {
    checkedIngredients.add(ingredient);

    let ingredientElement = document.createElement("div");
    ingredientElement.classList.add("remove");
    ingredientElement.id = ingredient;
    ingredientElement.onclick = () => removeIngredientFromList(ingredient);

    let closeButton = document.createElement("span");
    closeButton.classList.add("close");

    let ingredientName = document.createElement("span");
    ingredientName.innerText = ingredient;

    ingredientElement.appendChild(closeButton);
    ingredientElement.appendChild(ingredientName);

    // insert to ingredient-list
    document.getElementById("ingredient-list").appendChild(ingredientElement);
    updateListTips();
  }

  function removeIngredientFromList(ingredient) {
    checkedIngredients.delete(ingredient);
    document.getElementById(ingredient).remove();
    document.getElementById(ingredient + "-checkbox").checked = false;
    updateListTips();
  }

  function updateListTips() {
    if (checkedIngredients.size == 0) {
      // show empty list message
      document.getElementById("ingredient-empty").style.display = "block";
      // hide clear button
      document.getElementById("ingredient-clear").style.display = "none";
    } else {
      // hide empty list message
      document.getElementById("ingredient-empty").style.display = "none";
      // show clear button
      document.getElementById("ingredient-clear").style.display = "block";
    }
  }

  function clearIngredients() {
    checkedIngredients.forEach((ingredient) =>
      removeIngredientFromList(ingredient)
    );
  }

  function findRecipes() {
    if (checkedIngredients.size <= 0) return;
    let urlQuery =
      "http://google.com/search?q=" +
      "Recipes for " +
      Array.from(checkedIngredients).join(", ");
    if (window.self !== window.top) {
      handleSearch(urlQuery);
    } else {
      window.open(urlQuery);
    }
  }

  Array.from(document.getElementsByClassName("check-box")).forEach(
    (element) => {
      let ingredient = element.children[2].innerText;
      let checkbox = element.childNodes[1];
      checkbox.setAttribute("id", ingredient + "-checkbox");
      element.addEventListener("click", () => toggleIngredient(element));
    }
  );

  document
    .getElementById("ingredient-clear")
    .addEventListener("click", clearIngredients);

  document.getElementById("find-recipe").addEventListener("click", findRecipes);

  window.onmessage = function (event) {
    if (event.data) {
      if (event.data == "WAIT") {
        console.log("WAIT");
      } else if (event.data == "GO") {
        console.log("lets animate");
        $.Velocity.RunSequence(loading);
      }
    } else {
      console.log("HTML Code Element received a generic message:");
      console.log(event.data);
    }
  };

  function handleSearch(navigateTo) {
    window.parent.postMessage(
      {
        type: "click",
        label: "button",
        value: navigateTo,
      },
      "*"
    );
  }
});
