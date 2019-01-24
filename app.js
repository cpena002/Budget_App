// BUDGET CONTROLLER
var budgetController = (function(){
  //Expense function constructor.
  var Expense = function(id, description, value, percentage){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  // Function constructor to calculate the percentage of a given expense calculated agains the total money in the budget.
  Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
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
  };

  // Our data structure. Will hold the data related to our budget, such as income and expenses objects, totals of incomes and expense, budget grand total, and percentage of income spent.
  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    },
    budget: 0,
    percentage: -1
  };

  // functions included in the object returned by this module are poublic and accessible to other modules.
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

    deleteItem: function(type, id){
      var ids, index;
      //Loop over all objects and return an array of the object's ids.
      ids = data.allItems[type].map(function(current){
        return current.id;
      })

      // find the index of the ID we're looking for and store in a variable.
      index = ids.indexOf(id)

      // if the id is found, delete its corresponding object from the array of objects.
      if (index !== -1){
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget: function(){
        // calculate total income and expneses
        calculateTotal('expense');
        calculateTotal('income');
        // Calculate the budget: income - expneses
        data.budget = data.totals.income - data.totals.expense;
        // caluclate percentage of income that we spent
        if(data.totals.income > 0){
          data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
        } else {
          data.percentage = -1;
        }
    },

    calculatePercentages: function(){
      data.allItems.expense.forEach(function(current){
        current.calcPercentage(data.totals.income);
      });
    },

    getPercentages: function(){
      var allPercentages = data.allItems.expense.map(function(current){
        return current.getPercentage();
      });
      return allPercentages;
    },

    getBudget: function(){
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpenses: data.totals.expense,
        percentage: data.percentage
      };
    },

    testing: function (){
      console.log(data);
    }
  };

})();

// UI CONTROLLER
var UIController = (function(){
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabe: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  }

  var formatNumber = function(num, type){
    var numSplit;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    // Add a comma at the thousands place.
    if(int.length > 3){
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    };
    dec = numSplit[1];
    return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  // functions included in the object returned by this module are poublic and accessible to other modules.
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
        html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value"> %value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
      }
      // Replace placeholder text with actual data.
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      // Insert HTML into the DOM.
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deleteListItem: function(selectorID){
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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

    displayBudget: function(obj){
      var type;
      obj.budget > 0 ? type = 'income' : type = 'expense';

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
      document.querySelector(DOMStrings.expenseLabe).textContent = formatNumber(obj.totalExpenses, 'expense');


      if(obj.percentage > 0){
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function(percentages){
      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
      // A forEach function, but for nodeLists.
      var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++){
          callback(list[i], i);
        };
      };

      /* When nodeListForEach is called, we pass a callback function. That function is in turn  assigned to the 'callback' parameter in the function expression nodeListForEach above. In the function expression, we loop over the list and in each iteration we call the callback function. The code defined in the callback function will execute for each element in the list. */
      nodeListForEach(fields, function(current, index){
        // Code that is executed when the callback function is called.
        if(percentages[index] > 0 ){
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function(){
      var now, year, month;
      now = new Date();
      year = now.getFullYear;
      document.querySelector(DOMStrings.dateLabel).textContent = year;

    }

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
      };
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updatePercentages = function(){

    // 1. calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budgt controller.
    var percentages = budgetCtrl.getPercentages();
    // 3. Update the UI with the new percentages.
    UICtrl.displayPercentages(percentages);
  };

  var updateBudget = function(){
    // 1. Calculate the budget.
    budgetCtrl.calculateBudget();
    // 2. Return the budget.
    var budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var ctrlAddItem = function(){
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
      // 6. Calculate and update percentages.
      updatePercentages();
    };

  };

  var ctrlDeleteItem = function(event){
    var itemID, splitID, id;
    itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);

    if(itemID){
      splitID = itemID.split('-');
      type = splitID[0];
      id = parseInt(splitID[1]);
      // 1. delete the item form the data structure.
      budgetCtrl.deleteItem(type, id);
      // 2. delete the item from the UI.
      UICtrl.deleteListItem(itemID);
      // 3. update and who the new budget
      updateBudget();
      // 4. calculate and update percentages.
      updatePercentages();
    }
  };

  return {
    init: function(){
      console.log('started');
      UICtrl.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpenses: 0,
        percentage: 0
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController)

globalController.init();
