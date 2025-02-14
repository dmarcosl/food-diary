export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  whereToBuy: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface FoodEntry {
  id: string;
  name: string;
  dates: string[]; // Fechas en formato YYYY-MM-DD
  ingredients: Ingredient[];
  mealType: MealType;
}

export type FoodList = FoodEntry[]; 