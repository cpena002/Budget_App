// BUDGET CONTROLLER
var budgetController = (function(){
  // TO DO

})();

// UI CONTROLLER
var UIController = (function(){
  // TO DO

})();

// GLOBAL APP CONTROLLER
var globalController = (function(budgetCtrl, UICtrl){
  var ctrlAddItem = function(){
    // 1. get the field input data

    // 2. ad dthe item to the budget controller.

    // 3. Add the item to the UI

    // 4. Calculate the budget.

    // 5. Display the budget on the UI
    console.log('it works');
  }

  //Event Listeners
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function(event){
    if(event.keyCode === 13 || event.which === 13){
      ctrlAddItem();
    }

  });

})(budgetController, UIController)
