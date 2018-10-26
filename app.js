// BUDGET CONTROLLER
var budgetController = (function(){
  // functions included in the object returned by this module are poublic and accessible to other modules.

  //Expense function constructor.
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  }

  // Income function constructor.
  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var data = {
    allItems: {
      expenses: [],
      incomes: []
    },
    totals: {
      expenses: 0,
      incomces: 0
    }
  }

  return {
    addItem: function(type, des, val){
      var newItem, ID;
      //Create new ID to assign to income/expenses

        // the second set of brackets is to get the last avaialble position of the array.
      ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      console.log(ID);

      // Create new item based on 'inc' or 'exp' type.
      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc'){
        newItem = new Income(ID, des, val);
      }

      // Push item into our data structure. 
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem

    }
  }

})();

// UI CONTROLLER
var UIController = (function(){
  // functions included in the object returned by this module are poublic and accessible to other modules.

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn'
  }

  return {
    getInput: function(){
      //Get the type, description, and value enered by the user.
      return {
        /* We could have stored the values in a varialbes, but in order to return 3 values within the same object is easier to have the object return another object (the one we're in) */
        type: document.querySelector(DOMStrings.inputType).value, // Will either be inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },

    getDOMStrings: function (){
      return DOMStrings
    }
  }



})();

// GLOBAL APP CONTROLLER
var globalController = (function(budgetCtrl, UICtrl){
  var setupEventListeners = function(){
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });

  };


  var ctrlAddItem = function(){
    // 1. get the field input data
    var input = UICtrl.getInput();
    console.log(input);
    // 2. add the item to the budget controller.

    // 3. Add the item to the UI

    // 4. Calculate the budget.

    // 5. Display the budget on the UI

  };

  return {
    init: function(){
      console.log('started');
      setupEventListeners();
    }
  }

})(budgetController, UIController)

globalController.init();
