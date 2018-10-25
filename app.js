// BUDGET CONTROLLER
var budgetController = (function(){
  // functions included in the object returned by this module are poublic and accessible to other modules.

})();

// UI CONTROLLER
var UIController = (function(){
  // functions included in the object returned by this module are poublic and accessible to other modules.

  return {
    getInput: function(){
      //Get the type, description, and value enered by the user.
      return {
        /* We could have stored the values in a varialbes, but in order to return 3 values within the same object is easier to have the object return another object (the one we're in) */
        type: document.querySelector('.add__type').value, // Will either be inc or exp
        description: document.querySelector('.add__description').value,
        value: document.querySelector('.add__value').value
      }
    }
  }



})();

// GLOBAL APP CONTROLLER
var globalController = (function(budgetCtrl, UICtrl){
  var ctrlAddItem = function(){
    // 1. get the field input data
    var input = UICtrl.getInput();
    console.log(input);
    // 2. ad dthe item to the budget controller.

    // 3. Add the item to the UI

    // 4. Calculate the budget.

    // 5. Display the budget on the UI

  }

  //Event Listeners
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event){
    if(event.keyCode === 13 || event.which === 13){
      ctrlAddItem();
    }

  });

})(budgetController, UIController)
