// BUDGET CONTROLLER
var budgetController = (function(){
  // functions included in the object returned by this module are poublic and accessible to other modules.

  //Expense function constructor.
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Income function constructor.
  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(current){
      sum = sum + current.value;
    });
    data.totals[type] = sum;
  }

  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expenses: 0,
      incomes: 0
    },
    budget:0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val){
      var newItem, ID;
      //Create new ID to assign to income/expenses

      if (data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type.
      if(type === 'expense') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'income'){
        newItem = new Income(ID, des, val);
      }

      // Push item into our data structure.
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;

    },

    calculateBudget: function(){
        // calculate total income and expneses
        calculateTotal('expense');
        calculateTotal('income');
        // Calculate the budget: income - expneses
        data.budget = data.totals.incomes - data.totals.expenses;
        // caluclate percentage of income that we spent
        data.percentage = Math.round((data.totals.expenses / data.totals.incomes) * 100);
    },

    testing: function (){
      console.log(data);
    }
  };

})();

// UI CONTROLLER
var UIController = (function(){
  // functions included in the object returned by this module are poublic and accessible to other modules.

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  }

  return {
    getInput: function(){
      //Get the type, description, and value enered by the user.
      return {
        /* We could have stored the values in a varialbes, but in order to return 3 values within the same object is easier to have the object return another object (the one we're in) */
        type: document.querySelector(DOMStrings.inputType).value, // Will either be inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },

    addListItem: function(obj, type){
      var html, newHtml, element;
      // Create HTML string with place holer text.
      if (type === 'income'){
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
      } else if (type === 'expense') {
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">- %value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
      }
      // Replace placeholder text with actual data.
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      // Insert HTML into the DOM.
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    clearFields: function() {
      var fields, fieldsArray;

      fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array){
        current.value = "";
      });

      fieldsArray[0].focus();

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

  var updateBudget = function(){
    // 1. Calculate the budget.

    // 2. Return the budget.

    // 3. Display the budget on the UI

  }

  var ctrlAddItem = function(){html
    var input, newItem;
    // 1. get the field input data
    input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. add the item to the budget controller.
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the fields.
      UICtrl.clearFields();
      // 5. Calculate and update budget.
      updateBudget();
    }

  };

  return {
    init: function(){
      console.log('started');
      setupEventListeners();
    }
  }

})(budgetController, UIController)

globalController.init();
