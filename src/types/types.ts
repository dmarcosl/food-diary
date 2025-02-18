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

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface MenuDay {
  day: WeekDay;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export interface Menu {
  id: string;
  name: string;
  days: MenuDay[];
  includedDays: WeekDay[];
  includedMealTypes: MealType[];
}

export type MenuList = Menu[]; 