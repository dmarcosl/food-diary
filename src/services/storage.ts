import { Preferences } from '@capacitor/preferences';
import { FoodList, Ingredient, MealType } from '../types/types';

const STORAGE_KEY = 'food-history';
const THEME_KEY = 'dark-mode';
const SHOW_NEW_FIRST_KEY = 'show-new-first';
const SORT_DESCENDING_KEY = 'sort-descending';

export const StorageService = {
  async saveFoodList(foodList: FoodList) {
    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(foodList)
    });
  },

  async getFoodList(): Promise<FoodList> {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  },

  async addDateToFood(foodId: string, date: string) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          dates: [...food.dates, date].sort()
        };
      }
      return food;
    });
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async removeDate(foodId: string, date: string) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          dates: food.dates.filter(d => d !== date)
        };
      }
      return food;
    });
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async addFood(name: string, mealType: MealType) {
    const foodList = await this.getFoodList();
    const newFood = {
      id: Date.now().toString(),
      name,
      dates: [],
      ingredients: [],
      mealType
    };
    const updatedList = [...foodList, newFood];
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async removeFood(foodId: string) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.filter(food => food.id !== foodId);
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async updateFood(foodId: string, newName: string, mealType: MealType) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          name: newName,
          mealType
        };
      }
      return food;
    });
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async addIngredient(foodId: string, name: string, quantity: string, whereToBuy: string) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          ingredients: [...food.ingredients, {
            id: Date.now().toString(),
            name,
            quantity,
            whereToBuy
          }]
        };
      }
      return food;
    });
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async removeIngredient(foodId: string, ingredientId: string) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          ingredients: food.ingredients.filter(ing => ing.id !== ingredientId)
        };
      }
      return food;
    });
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async updateIngredientsOrder(foodId: string, ingredients: Ingredient[]) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          ingredients
        };
      }
      return food;
    });
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async updateIngredient(foodId: string, ingredientId: string, name: string, quantity: string, whereToBuy: string) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          ingredients: food.ingredients.map(ing => {
            if (ing.id === ingredientId) {
              return {
                ...ing,
                name,
                quantity,
                whereToBuy
              };
            }
            return ing;
          })
        };
      }
      return food;
    });
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async updateFoodMealType(foodId: string, mealType: MealType) {
    const foodList = await this.getFoodList();
    const updatedList = foodList.map(food => {
      if (food.id === foodId) {
        return {
          ...food,
          mealType
        };
      }
      return food;
    });
    await this.saveFoodList(updatedList);
    return updatedList;
  },

  async saveThemePreference(isDarkMode: boolean) {
    await Preferences.set({
      key: THEME_KEY,
      value: JSON.stringify(isDarkMode)
    });
  },

  async getThemePreference(): Promise<boolean> {
    const { value } = await Preferences.get({ key: THEME_KEY });
    return value ? JSON.parse(value) : false;
  },

  async saveShowNewFirstPreference(showNewFirst: boolean) {
    await Preferences.set({
      key: SHOW_NEW_FIRST_KEY,
      value: JSON.stringify(showNewFirst)
    });
  },

  async getShowNewFirstPreference(): Promise<boolean> {
    const { value } = await Preferences.get({ key: SHOW_NEW_FIRST_KEY });
    return value ? JSON.parse(value) : false;
  },

  async saveSortDescendingPreference(sortDescending: boolean) {
    await Preferences.set({
      key: SORT_DESCENDING_KEY,
      value: JSON.stringify(sortDescending)
    });
  },

  async getSortDescendingPreference(): Promise<boolean> {
    const { value } = await Preferences.get({ key: SORT_DESCENDING_KEY });
    return value ? JSON.parse(value) : true;
  }
}; 