/**
 * Customisable sets of action steps for the order.
 */
 const actions = [
   // COMMON STEPS
   { id: 0, description: "Order Taken" },
   { id: 1, description: "Sufficient Stock" },
   { id: 2, description: "Insufficient stock." },
   //MEATBALL OPTIONS
   { id: 3, description: "Preparing Hamburger with beef..." },
   { id: 4, description: "Rare meatball is being prepared." },
   { id: 5, description: "Medium meatball is being prepared" },
   { id: 6, description: "Well cooked meatball is being prepared." },
   //CHICKEN OPTION
   { id: 7, description: "Chicken meal is being prepared." },
   // COMMON STEPS
   { id: 8, description: "Burger ready" },
   { id: 9, description: "French fries are being prepared." },
   { id: 10, description: "Soft drinks are being prepared." },
   { id: 11, description: "Meal ready." },
];

let ingredients = {
   lettuce: 5,
   sauce: 7,
   cola: 5,
   onion: 5,
   chicken: 5,
   meatball: 5,
   tomato: 5,
   bread: 5,
   potato: 5,
};

let MEAT_OPTIONS = ["Meatball", "Chicken"];
let COOKING_TIME = ["Rare", "Medium", "Well"];

const orderKofte = {
   meatType: "Meatball",
   cookingTime: "Well"
};

const orderTavuk = {
   meatType: "Chicken",
   cookingTime:'Medium'
};

function createActionStep(time, isValid, successMessage, errorMessage) {
   return new Promise((resolve, reject) => {
      if (isValid) {
         setTimeout(() => {
            resolve(console.log(successMessage.description));
         }, time);
      }
      else if (isValid === false) {
         setTimeout(() => {
            reject(console.log(errorMessage.description));
         }, time);
      }
      else { reject(console.error("System failure")); }
   });
}

function hasSufficientIngredients(stock, actions) {
   return new Promise((resolve, reject) => {
      let hasStufficientIngredients = Object.values(stock).every((item) => item > 0);
      if (hasStufficientIngredients) {
         setTimeout(() => { resolve(console.log(actions[1].description)); }, 3000);
      }
      else {
         setTimeout(() => { reject(new Error(actions[2].description)); }, 3000);
      }
   });
}

function checkMeatType(order, actions) {
   return new Promise(async (resolve, reject) => {
      if (order.meatType === "Meatball") {
         setTimeout(() => {
            resolve(console.log(actions[3].description));
         }, 1000);
      } else if (order.meatType === "Chicken") {
         setTimeout(() => {
            resolve(console.log(actions[7].description));
         }, 1000);
      } else {
         reject(new Error(`Not a valid meat option:  ${order.meatType}`));
      }
   });
}

function checkCookingTime(order, actions) {
   return new Promise(async (resolve, reject) => {
      switch (order.cookingTime) {
         case "Rare":
            await checkMeatType(order, actions);
            setTimeout(() => {
               resolve(console.log(actions[4].description));
            }, 2000);
            break;
         case "Medium":
            await checkMeatType(order, actions);
            setTimeout(() => {
               resolve(console.log(actions[5].description));
            }, 3000);
            break;
         case "Well":
            await checkMeatType(order, actions);
            setTimeout(() => {
               resolve(console.log(actions[6].description));
            }, 4000);
            break;
         default:
            reject(new Error("Not a valid request."));
            break;
      }
   });
}

function prepareBurger(order, actions, currentStock) {
   return new Promise(async (resolve) => {
      await checkCookingTime(order, actions);
      setTimeout(() => {
         Object.entries(currentStock).map((item) => {
            const ingredientName = item[0];
            if (order.meatType === "Meatball") {
               currentStock[ingredientName]--;
               if (ingredientName === "chicken") {
                  currentStock[ingredientName]++;
               }
            }
            else {
               currentStock[ingredientName]--;
               if (ingredientName === "meatball") {
                  currentStock[ingredientName]++;
               }
            }
         });
         resolve(console.log(actions[8].description));
      }, 2000);
   });
}

async function combineActions(order, currentStock, actions) {
   return new Promise((resolve) => {
      resolve(
         prepareBurger(order, actions, currentStock),
         createActionStep(5000, true, actions[9]),
         createActionStep(2000, true, actions[10])
      );
   });
}

/**
 * 
 * @param {*} order - defined by selecting meat type plus cooking time desired for meatball
 * @param {*} currentStock  - current list of ingredients
 * @param {*} actions - comprehensive list of steps to prepare the order
 */
async function createOrder(order, currentStock, actions) {
   try {
      await createActionStep(1000, true, actions[0]);
      await hasSufficientIngredients(currentStock, actions);
      await combineActions(order, currentStock, actions);
      await createActionStep(1000, true, actions[11]);
   }
   catch (error) { console.log(error); }
}

createOrder(orderKofte, ingredients, actions);