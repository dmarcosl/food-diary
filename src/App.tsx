import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage, IntlProvider } from 'react-intl';
import { FoodList, FoodEntry, Ingredient, MealType } from './types/types';
import { StorageService } from './services/storage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import './App.css';
import en from './i18n/en';
import es from './i18n/es';

const getMessages = (locale: string) => {
  switch (locale) {
    case 'es':
      return es;
    default:
      return en;
  }
};

function App() {
  const intl = useIntl();
  const [foods, setFoods] = useState<FoodList>([]);
  const [newFoodName, setNewFoodName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingFood, setEditingFood] = useState<FoodEntry | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAllDates, setShowAllDates] = useState<string | null>(null);
  const [foodToDelete, setFoodToDelete] = useState<FoodEntry | null>(null);
  const [dateToDelete, setDateToDelete] = useState<{foodId: string, date: string} | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [showIngredients, setShowIngredients] = useState<string | null>(null);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<{foodId: string, ingredient: Ingredient} | null>(null);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
  const [newIngredientWhereToBuy, setNewIngredientWhereToBuy] = useState('');
  const [editingIngredient, setEditingIngredient] = useState<{foodId: string, ingredient: Ingredient} | null>(null);
  const [draggingIngredient, setDraggingIngredient] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [currentTab, setCurrentTab] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNewFirst, setShowNewFirst] = useState(false);
  const [sortDescending, setSortDescending] = useState(true);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const locale = navigator.language.split('-')[0];
  const messages = getMessages(locale);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    loadFoods();
    loadThemePreference();
    loadShowNewFirstPreference();
    loadSortDescendingPreference();
  }, []);

  const loadFoods = async () => {
    const storedFoods = await StorageService.getFoodList();
    setFoods(storedFoods);
  };

  const loadThemePreference = async () => {
    const isDark = await StorageService.getThemePreference();
    setIsDarkMode(isDark);
  };

  const loadShowNewFirstPreference = async () => {
    const showFirst = await StorageService.getShowNewFirstPreference();
    setShowNewFirst(showFirst);
  };

  const loadSortDescendingPreference = async () => {
    const sortDesc = await StorageService.getSortDescendingPreference();
    setSortDescending(sortDesc);
  };

  const handleThemeChange = async (checked: boolean) => {
    setIsDarkMode(checked);
    await StorageService.saveThemePreference(checked);
  };

  const handleShowNewFirstChange = async (checked: boolean) => {
    setShowNewFirst(checked);
    await StorageService.saveShowNewFirstPreference(checked);
  };

  const handleSortDescendingChange = async (checked: boolean) => {
    setSortDescending(checked);
    await StorageService.saveSortDescendingPreference(checked);
  };

  const handleAddDate = async (foodId: string, date: string) => {
    const updatedFoods = await StorageService.addDateToFood(foodId, date);
    setFoods(updatedFoods);
    setIsDateModalOpen(false);
    setSelectedFoodId(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFoodName.trim()) {
      const updatedFoods = await StorageService.addFood(
        newFoodName.trim(),
        selectedMealType
      );
      setFoods(updatedFoods);
      setNewFoodName('');
      switch (selectedMealType) {
        case 'breakfast':
          setCurrentTab(0);
          break;
        case 'lunch':
          setCurrentTab(1);
          break;
        case 'dinner':
          setCurrentTab(2);
          break;
      }
      setSelectedMealType('breakfast');
      setIsModalOpen(false);
    }
  };

  const handleRemoveFood = async () => {
    if (!foodToDelete) return;
    const updatedFoods = await StorageService.removeFood(foodToDelete.id);
    setFoods(updatedFoods);
    setExpandedId(null);
    setFoodToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewFoodName('');
    setEditingFood(null);
  };

  const handleEditFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFood && newFoodName.trim()) {
      const updatedFoods = await StorageService.updateFood(
        editingFood.id,
        newFoodName.trim(),
        selectedMealType
      );
      setFoods(updatedFoods);
      setNewFoodName('');
      setEditingFood(null);
      setSelectedMealType('breakfast');
    }
  };

  const startEditing = (food: FoodEntry) => {
    setEditingFood(food);
    setNewFoodName(food.name);
    setSelectedMealType(food.mealType);
  };

  const toggleExpand = (foodId: string) => {
    setExpandedId(expandedId === foodId ? null : foodId);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekDay = intl.formatMessage({ id: `weekday.${['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()]}` });
    return `${date.toISOString().split('T')[0]} ${weekDay}`;
  };

  const getLatestDate = (dates: string[]) => {
    return dates.length > 0 
      ? formatDate(dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0])
      : intl.formatMessage({ id: 'text.noRecords' });
  };

  const openDateModal = (foodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFoodId(foodId);
    setIsDateModalOpen(true);
  };

  const closeDateModal = () => {
    setIsDateModalOpen(false);
    setSelectedFoodId(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const openDeleteModal = (e: React.MouseEvent, food: FoodEntry) => {
    e.stopPropagation();
    setFoodToDelete(food);
  };

  const closeDeleteModal = () => {
    setFoodToDelete(null);
  };

  const toggleHistory = (e: React.MouseEvent, foodId: string) => {
    e.stopPropagation();
    setShowHistory(showHistory === foodId ? null : foodId);
  };

  const toggleIngredients = (e: React.MouseEvent, foodId: string) => {
    e.stopPropagation();
    setShowIngredients(showIngredients === foodId ? null : foodId);
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFoodId && newIngredientName.trim() && newIngredientQuantity.trim()) {
      const updatedFoods = await StorageService.addIngredient(
        selectedFoodId,
        newIngredientName.trim(),
        newIngredientQuantity.trim(),
        newIngredientWhereToBuy.trim()
      );
      setFoods(updatedFoods);
      setNewIngredientName('');
      setNewIngredientQuantity('');
      setNewIngredientWhereToBuy('');
      setIsIngredientModalOpen(false);
      setSelectedFoodId(null);
    }
  };

  const handleRemoveIngredient = async () => {
    if (!ingredientToDelete) return;
    const updatedFoods = await StorageService.removeIngredient(
      ingredientToDelete.foodId,
      ingredientToDelete.ingredient.id
    );
    setFoods(updatedFoods);
    setIngredientToDelete(null);
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent, ingredientId: string) => {
    setDraggingIngredient(ingredientId);
  };

  const handleDragEnd = async (foodId: string, ingredients: Ingredient[]) => {
    setDraggingIngredient(null);
    const updatedFoods = await StorageService.updateIngredientsOrder(foodId, ingredients);
    setFoods(updatedFoods);
  };

  const handleRemoveDate = async () => {
    if (!dateToDelete) return;
    const updatedFoods = await StorageService.removeDate(
      dateToDelete.foodId,
      dateToDelete.date
    );
    setFoods(updatedFoods);
    setDateToDelete(null);
  };

  const handleEditIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIngredient && newIngredientName.trim() && newIngredientQuantity.trim()) {
      const updatedFoods = await StorageService.updateIngredient(
        editingIngredient.foodId,
        editingIngredient.ingredient.id,
        newIngredientName.trim(),
        newIngredientQuantity.trim(),
        newIngredientWhereToBuy.trim()
      );
      setFoods(updatedFoods);
      setNewIngredientName('');
      setNewIngredientQuantity('');
      setNewIngredientWhereToBuy('');
      setEditingIngredient(null);
    }
  };

  const startEditingIngredient = (foodId: string, ingredient: Ingredient) => {
    setEditingIngredient({ foodId, ingredient });
    setNewIngredientName(ingredient.name);
    setNewIngredientQuantity(ingredient.quantity);
    setNewIngredientWhereToBuy(ingredient.whereToBuy);
  };

  const handleModalOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
      closeDateModal();
      closeDeleteModal();
      setIngredientToDelete(null);
      setDateToDelete(null);
      setIsIngredientModalOpen(false);
      setEditingIngredient(null);
    }
  };

  const sortFoodItems = (foods: FoodEntry[], mealType: MealType) => {
    const filteredFoods = foods.filter(food => food.mealType === mealType);
    const withDates = filteredFoods.filter(food => food.dates.length > 0);
    const withoutDates = filteredFoods.filter(food => food.dates.length === 0);
    
    // Ordenar items con fechas
    withDates.sort((a, b) => {
      const dateA = new Date(a.dates.sort((x, y) => new Date(y).getTime() - new Date(x).getTime())[0]);
      const dateB = new Date(b.dates.sort((x, y) => new Date(y).getTime() - new Date(x).getTime())[0]);
      const dateDiff = sortDescending ? 
        dateB.getTime() - dateA.getTime() : 
        dateA.getTime() - dateB.getTime();
      
      // Si tienen la misma fecha, ordenar alfabéticamente
      if (dateDiff === 0) {
        return a.name.localeCompare(b.name);
      }
      return dateDiff;
    });

    // Ordenar items sin fechas alfabéticamente
    withoutDates.sort((a, b) => a.name.localeCompare(b.name));

    // Retornar array combinado según la preferencia
    return showNewFirst ? 
      [...withoutDates, ...withDates] : 
      [...withDates, ...withoutDates];
  };

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="en">
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="app-header">
          <h1>
            <FormattedMessage 
              id={
                currentTab === 0 ? 'meal.breakfast' :
                currentTab === 1 ? 'meal.lunch' :
                'meal.dinner'
              }
            />
          </h1>
          <button 
            className="menu-button"
            onClick={() => setIsSidenavOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>

        <Drawer
          anchor="right"
          open={isSidenavOpen}
          onClose={() => setIsSidenavOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
              color: isDarkMode ? '#fff' : 'inherit'
            }
          }}
        >
          <div className="sidenav-content">
            <h2><FormattedMessage id="settings.title" /></h2>
            <Divider />
            <div className="theme-toggle">
              <span><FormattedMessage id="settings.darkMode" /></span>
              <Switch
                checked={isDarkMode}
                onChange={(e) => handleThemeChange(e.target.checked)}
              />
            </div>
            <div className="theme-toggle">
              <span><FormattedMessage id="settings.showNewFirst" /></span>
              <Switch
                checked={showNewFirst}
                onChange={(e) => handleShowNewFirstChange(e.target.checked)}
              />
            </div>
            <div className="theme-toggle">
              <span><FormattedMessage id="settings.sortDescending" /></span>
              <Switch
                checked={sortDescending}
                onChange={(e) => handleSortDescendingChange(e.target.checked)}
              />
            </div>
          </div>
        </Drawer>

        <div className="food-content">
          {currentTab === 0 && (
            <div className="food-list">
              {sortFoodItems(foods, 'breakfast').length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-content">
                    <p className="empty-state-text">
                      <FormattedMessage id="text.noItems" />
                    </p>
                    <p className="empty-state-subtext">
                      <FormattedMessage id="text.tapToAdd" />
                    </p>
                  </div>
                </div>
              ) : (
                sortFoodItems(foods, 'breakfast').map(food => (
                  <div 
                    key={food.id} 
                    className={`food-item ${expandedId === food.id ? 'expanded' : ''}`}
                  >
                    <div 
                      className="food-summary"
                      onClick={() => toggleExpand(food.id)}
                    >
                      <h2>{food.name}</h2>
                      <span className="latest-date">{getLatestDate(food.dates)}</span>
                    </div>
                    {expandedId === food.id && (
                    <div className="food-details">
                      <div className="action-buttons">
                        <div className="left-buttons">
                          <button 
                            onClick={(e) => openDateModal(food.id, e)}
                            className="add-date-button"
                          >
                            <FormattedMessage id="button.addDate" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFoodId(food.id);
                              setIsIngredientModalOpen(true);
                            }}
                            className="add-ingredient-button"
                          >
                            <FormattedMessage id="button.addIngredient" />
                          </button>
                        </div>
                        <div className="right-buttons">
                          <button 
                            onClick={() => startEditing(food)}
                            className="edit-button"
                          >
                            <FormattedMessage id="button.edit" />
                          </button>
                          <button 
                            onClick={(e) => openDeleteModal(e, food)}
                            className="remove-button"
                          >
                            <FormattedMessage id="button.delete" />
                          </button>
                        </div>
                      </div>
                      {food.ingredients.length > 0 && (
                        <button 
                          className="view-ingredients-button"
                          onClick={(e) => toggleIngredients(e, food.id)}
                        >
                          <FormattedMessage 
                            id={showIngredients === food.id ? 'button.hideIngredients' : 'button.showIngredients'} 
                          />
                        </button>
                      )}
                      {showIngredients === food.id && (
                      <div className="ingredients-list">
                        {food.ingredients.map((ingredient, index) => (
                          <div 
                            key={ingredient.id}
                            className={`ingredient-item ${draggingIngredient === ingredient.id ? 'dragging' : ''}`}
                            onTouchStart={(e) => handleDragStart(e, ingredient.id)}
                            onMouseDown={(e) => handleDragStart(e, ingredient.id)}
                            onTouchEnd={() => handleDragEnd(food.id, food.ingredients)}
                            onMouseUp={() => handleDragEnd(food.id, food.ingredients)}
                          >
                            <div className="ingredient-content">
                              <span className="ingredient-name">{ingredient.name}</span>
                              <span className="ingredient-quantity">{ingredient.quantity}</span>
                              {ingredient.whereToBuy && (
                                <span className="ingredient-where-to-buy">({ingredient.whereToBuy})</span>
                              )}
                            </div>
                            <div className="ingredient-actions">
                              <button
                                className="edit-ingredient-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingIngredient(food.id, ingredient);
                                }}
                              >
                                <EditIcon sx={{ color: '#2196F3' }} />
                              </button>
                              <button
                                className="delete-ingredient-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIngredientToDelete({ foodId: food.id, ingredient });
                                }}
                              >
                                <DeleteIcon sx={{ color: '#f44336' }} />
                              </button>
                              <div className="drag-handle">
                                <DragIndicatorIcon sx={{ color: '#757575' }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      )}
                      {food.dates.length > 0 && (
                        <button 
                          className="view-history-button"
                          onClick={(e) => toggleHistory(e, food.id)}
                        >
                          <FormattedMessage 
                            id={showHistory === food.id ? 'button.hideHistory' : 'button.showHistory'} 
                          />
                        </button>
                      )}
                      {showHistory === food.id && (
                      <div className="dates-list">
                        {food.dates
                          .sort((a, b) => {
                            const dateA = new Date(a).getTime();
                            const dateB = new Date(b).getTime();
                            return sortDescending ? 
                              dateB - dateA : 
                              dateA - dateB;
                          })
                          .slice(0, showAllDates === food.id ? undefined : 5)
                          .map((date, index) => (
                          <div key={index} className="date-item">
                            <span>{formatDate(date)}</span>
                            <button
                              className="delete-date-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDateToDelete({ foodId: food.id, date });
                              }}
                            >
                              <DeleteIcon sx={{ color: '#f44336' }} />
                            </button>
                          </div>
                        ))}
                        {food.dates.length > 5 && showAllDates !== food.id && (
                          <button 
                            className="show-more-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllDates(food.id);
                            }}
                          >
                            <FormattedMessage 
                              id="button.showMore" 
                              values={{ count: food.dates.length }} 
                            />
                          </button>
                        )}
                        {showAllDates === food.id && (
                          <button 
                            className="show-more-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllDates(null);
                            }}
                          >
                            <FormattedMessage id="button.showLess" />
                          </button>
                        )}
                      </div>
                      )}
                    </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          {currentTab === 1 && (
            <div className="food-list">
              {sortFoodItems(foods, 'lunch').length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-content">
                    <p className="empty-state-text">
                      <FormattedMessage id="text.noItems" />
                    </p>
                    <p className="empty-state-subtext">
                      <FormattedMessage id="text.tapToAdd" />
                    </p>
                  </div>
                </div>
              ) : (
                sortFoodItems(foods, 'lunch').map(food => (
                  <div 
                    key={food.id} 
                    className={`food-item ${expandedId === food.id ? 'expanded' : ''}`}
                  >
                    <div 
                      className="food-summary"
                      onClick={() => toggleExpand(food.id)}
                    >
                      <h2>{food.name}</h2>
                      <span className="latest-date">{getLatestDate(food.dates)}</span>
                    </div>
                    {expandedId === food.id && (
                    <div className="food-details">
                      <div className="action-buttons">
                        <div className="left-buttons">
                          <button 
                            onClick={(e) => openDateModal(food.id, e)}
                            className="add-date-button"
                          >
                            <FormattedMessage id="button.addDate" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFoodId(food.id);
                              setIsIngredientModalOpen(true);
                            }}
                            className="add-ingredient-button"
                          >
                            <FormattedMessage id="button.addIngredient" />
                          </button>
                        </div>
                        <div className="right-buttons">
                          <button 
                            onClick={() => startEditing(food)}
                            className="edit-button"
                          >
                            <FormattedMessage id="button.edit" />
                          </button>
                          <button 
                            onClick={(e) => openDeleteModal(e, food)}
                            className="remove-button"
                          >
                            <FormattedMessage id="button.delete" />
                          </button>
                        </div>
                      </div>
                      {food.ingredients.length > 0 && (
                        <button 
                          className="view-ingredients-button"
                          onClick={(e) => toggleIngredients(e, food.id)}
                        >
                          <FormattedMessage 
                            id={showIngredients === food.id ? 'button.hideIngredients' : 'button.showIngredients'} 
                          />
                        </button>
                      )}
                      {showIngredients === food.id && (
                      <div className="ingredients-list">
                        {food.ingredients.map((ingredient, index) => (
                          <div 
                            key={ingredient.id}
                            className={`ingredient-item ${draggingIngredient === ingredient.id ? 'dragging' : ''}`}
                            onTouchStart={(e) => handleDragStart(e, ingredient.id)}
                            onMouseDown={(e) => handleDragStart(e, ingredient.id)}
                            onTouchEnd={() => handleDragEnd(food.id, food.ingredients)}
                            onMouseUp={() => handleDragEnd(food.id, food.ingredients)}
                          >
                            <div className="ingredient-content">
                              <span className="ingredient-name">{ingredient.name}</span>
                              <span className="ingredient-quantity">{ingredient.quantity}</span>
                              {ingredient.whereToBuy && (
                                <span className="ingredient-where-to-buy">({ingredient.whereToBuy})</span>
                              )}
                            </div>
                            <div className="ingredient-actions">
                              <button
                                className="edit-ingredient-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingIngredient(food.id, ingredient);
                                }}
                              >
                                <EditIcon sx={{ color: '#2196F3' }} />
                              </button>
                              <button
                                className="delete-ingredient-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIngredientToDelete({ foodId: food.id, ingredient });
                                }}
                              >
                                <DeleteIcon sx={{ color: '#f44336' }} />
                              </button>
                              <div className="drag-handle">
                                <DragIndicatorIcon sx={{ color: '#757575' }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      )}
                      {food.dates.length > 0 && (
                        <button 
                          className="view-history-button"
                          onClick={(e) => toggleHistory(e, food.id)}
                        >
                          <FormattedMessage 
                            id={showHistory === food.id ? 'button.hideHistory' : 'button.showHistory'} 
                          />
                        </button>
                      )}
                      {showHistory === food.id && (
                      <div className="dates-list">
                        {food.dates
                          .sort((a, b) => {
                            const dateA = new Date(a).getTime();
                            const dateB = new Date(b).getTime();
                            return sortDescending ? 
                              dateB - dateA : 
                              dateA - dateB;
                          })
                          .slice(0, showAllDates === food.id ? undefined : 5)
                          .map((date, index) => (
                          <div key={index} className="date-item">
                            <span>{formatDate(date)}</span>
                            <button
                              className="delete-date-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDateToDelete({ foodId: food.id, date });
                              }}
                            >
                              <DeleteIcon sx={{ color: '#f44336' }} />
                            </button>
                          </div>
                        ))}
                        {food.dates.length > 5 && showAllDates !== food.id && (
                          <button 
                            className="show-more-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllDates(food.id);
                            }}
                          >
                            <FormattedMessage 
                              id="button.showMore" 
                              values={{ count: food.dates.length }} 
                            />
                          </button>
                        )}
                        {showAllDates === food.id && (
                          <button 
                            className="show-more-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllDates(null);
                            }}
                          >
                            <FormattedMessage id="button.showLess" />
                          </button>
                        )}
                      </div>
                      )}
                    </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          {currentTab === 2 && (
            <div className="food-list">
              {sortFoodItems(foods, 'dinner').length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-content">
                    <p className="empty-state-text">
                      <FormattedMessage id="text.noItems" />
                    </p>
                    <p className="empty-state-subtext">
                      <FormattedMessage id="text.tapToAdd" />
                    </p>
                  </div>
                </div>
              ) : (
                sortFoodItems(foods, 'dinner').map(food => (
                  <div 
                    key={food.id} 
                    className={`food-item ${expandedId === food.id ? 'expanded' : ''}`}
                  >
                    <div 
                      className="food-summary"
                      onClick={() => toggleExpand(food.id)}
                    >
                      <h2>{food.name}</h2>
                      <span className="latest-date">{getLatestDate(food.dates)}</span>
                    </div>
                    {expandedId === food.id && (
                    <div className="food-details">
                      <div className="action-buttons">
                        <div className="left-buttons">
                          <button 
                            onClick={(e) => openDateModal(food.id, e)}
                            className="add-date-button"
                          >
                            <FormattedMessage id="button.addDate" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFoodId(food.id);
                              setIsIngredientModalOpen(true);
                            }}
                            className="add-ingredient-button"
                          >
                            <FormattedMessage id="button.addIngredient" />
                          </button>
                        </div>
                        <div className="right-buttons">
                          <button 
                            onClick={() => startEditing(food)}
                            className="edit-button"
                          >
                            <FormattedMessage id="button.edit" />
                          </button>
                          <button 
                            onClick={(e) => openDeleteModal(e, food)}
                            className="remove-button"
                          >
                            <FormattedMessage id="button.delete" />
                          </button>
                        </div>
                      </div>
                      {food.ingredients.length > 0 && (
                        <button 
                          className="view-ingredients-button"
                          onClick={(e) => toggleIngredients(e, food.id)}
                        >
                          <FormattedMessage 
                            id={showIngredients === food.id ? 'button.hideIngredients' : 'button.showIngredients'} 
                          />
                        </button>
                      )}
                      {showIngredients === food.id && (
                      <div className="ingredients-list">
                        {food.ingredients.map((ingredient, index) => (
                          <div 
                            key={ingredient.id}
                            className={`ingredient-item ${draggingIngredient === ingredient.id ? 'dragging' : ''}`}
                            onTouchStart={(e) => handleDragStart(e, ingredient.id)}
                            onMouseDown={(e) => handleDragStart(e, ingredient.id)}
                            onTouchEnd={() => handleDragEnd(food.id, food.ingredients)}
                            onMouseUp={() => handleDragEnd(food.id, food.ingredients)}
                          >
                            <div className="ingredient-content">
                              <span className="ingredient-name">{ingredient.name}</span>
                              <span className="ingredient-quantity">{ingredient.quantity}</span>
                              {ingredient.whereToBuy && (
                                <span className="ingredient-where-to-buy">({ingredient.whereToBuy})</span>
                              )}
                            </div>
                            <div className="ingredient-actions">
                              <button
                                className="edit-ingredient-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingIngredient(food.id, ingredient);
                                }}
                              >
                                <EditIcon sx={{ color: '#2196F3' }} />
                              </button>
                              <button
                                className="delete-ingredient-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIngredientToDelete({ foodId: food.id, ingredient });
                                }}
                              >
                                <DeleteIcon sx={{ color: '#f44336' }} />
                              </button>
                              <div className="drag-handle">
                                <DragIndicatorIcon sx={{ color: '#757575' }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      )}
                      {food.dates.length > 0 && (
                        <button 
                          className="view-history-button"
                          onClick={(e) => toggleHistory(e, food.id)}
                        >
                          <FormattedMessage 
                            id={showHistory === food.id ? 'button.hideHistory' : 'button.showHistory'} 
                          />
                        </button>
                      )}
                      {showHistory === food.id && (
                      <div className="dates-list">
                        {food.dates
                          .sort((a, b) => {
                            const dateA = new Date(a).getTime();
                            const dateB = new Date(b).getTime();
                            return sortDescending ? 
                              dateB - dateA : 
                              dateA - dateB;
                          })
                          .slice(0, showAllDates === food.id ? undefined : 5)
                          .map((date, index) => (
                          <div key={index} className="date-item">
                            <span>{formatDate(date)}</span>
                            <button
                              className="delete-date-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDateToDelete({ foodId: food.id, date });
                              }}
                            >
                              <DeleteIcon sx={{ color: '#f44336' }} />
                            </button>
                          </div>
                        ))}
                        {food.dates.length > 5 && showAllDates !== food.id && (
                          <button 
                            className="show-more-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllDates(food.id);
                            }}
                          >
                            <FormattedMessage 
                              id="button.showMore" 
                              values={{ count: food.dates.length }} 
                            />
                          </button>
                        )}
                        {showAllDates === food.id && (
                          <button 
                            className="show-more-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllDates(null);
                            }}
                          >
                            <FormattedMessage id="button.showLess" />
                          </button>
                        )}
                      </div>
                      )}
                    </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
          >
            <BottomNavigationAction label={intl.formatMessage({ id: 'meal.breakfast' })} icon={<BreakfastDiningIcon />} />
            <BottomNavigationAction label={intl.formatMessage({ id: 'meal.lunch' })} icon={<LunchDiningIcon />} />
            <BottomNavigationAction label={intl.formatMessage({ id: 'meal.dinner' })} icon={<DinnerDiningIcon />} />
          </BottomNavigation>
        </Paper>

        <button 
          className="fab-button" 
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>

        {(isModalOpen || editingFood) && (
          <div className="modal-overlay" onClick={handleModalOverlayClick}>
            <div className="modal">
              <h2><FormattedMessage id={editingFood ? 'modal.editFood' : 'modal.addFood'} /></h2>
              <form onSubmit={editingFood ? handleEditFood : handleAddFood}>
                <input
                  type="text"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'input.foodName' })}
                  className="food-input"
                  autoFocus
                />
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value as MealType)}
                  >
                    <FormControlLabel 
                      value="breakfast" 
                      control={<Radio />} 
                      label={intl.formatMessage({ id: 'meal.breakfast' })}
                    />
                    <FormControlLabel 
                      value="lunch" 
                      control={<Radio />} 
                      label={intl.formatMessage({ id: 'meal.lunch' })}
                    />
                    <FormControlLabel 
                      value="dinner" 
                      control={<Radio />} 
                      label={intl.formatMessage({ id: 'meal.dinner' })}
                    />
                  </RadioGroup>
                </FormControl>
                <div className="modal-buttons">
                  <button type="button" onClick={handleCloseModal} className="cancel-button">
                    <FormattedMessage id="button.cancel" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={!newFoodName.trim()}
                    className={`add-button ${!newFoodName.trim() ? 'disabled' : ''}`}
                  >
                    <FormattedMessage id={editingFood ? 'button.save' : 'button.add'} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDateModalOpen && (
          <div className="modal-overlay" onClick={handleModalOverlayClick}>
            <div className="modal">
              <h2><FormattedMessage id="modal.addDate" /></h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (selectedFoodId && selectedDate) {
                  handleAddDate(selectedFoodId, selectedDate);
                }
              }}>
                <input
                  type="date"
                  value={selectedDate}
                  required
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                  autoFocus
                />
                <div className="modal-buttons">
                  <button type="button" onClick={closeDateModal} className="cancel-button">
                    <FormattedMessage id="button.cancel" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={!selectedDate || !selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)}
                    className={`add-button ${!selectedDate || !selectedDate.match(/^\d{4}-\d{2}-\d{2}$/) ? 'disabled' : ''}`}
                  >
                    <FormattedMessage id="button.add" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {foodToDelete && (
          <div className="modal-overlay" onClick={handleModalOverlayClick}>
            <div className="modal delete-modal">
              <h2><FormattedMessage id="modal.deleteConfirm" /></h2>
              <p><FormattedMessage id="modal.deleteFood" values={{ name: foodToDelete.name }} /></p>
              <p className="delete-warning"><FormattedMessage id="modal.deleteWarning" /></p>
              <div className="modal-buttons">
                <button 
                  type="button" 
                  onClick={closeDeleteModal} 
                  className="cancel-button"
                >
                  <FormattedMessage id="button.cancel" />
                </button>
                <button 
                  type="button" 
                  onClick={handleRemoveFood} 
                  className="delete-confirm-button"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {(isIngredientModalOpen || editingIngredient) && (
          <div className="modal-overlay" onClick={handleModalOverlayClick}>
            <div className="modal">
              <h2><FormattedMessage id={editingIngredient ? 'modal.editIngredient' : 'modal.addIngredient'} /></h2>
              <form onSubmit={editingIngredient ? handleEditIngredient : handleAddIngredient}>
                <input
                  type="text"
                  value={newIngredientName}
                  onChange={(e) => setNewIngredientName(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'input.ingredientName' })}
                  className="ingredient-input"
                  autoFocus
                />
                <input
                  type="text"
                  value={newIngredientQuantity}
                  onChange={(e) => setNewIngredientQuantity(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'input.ingredientQuantity' })}
                  className="ingredient-input"
                />
                <input
                  type="text"
                  value={newIngredientWhereToBuy}
                  onChange={(e) => setNewIngredientWhereToBuy(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'input.ingredientWhereToBuy' })}
                  className="ingredient-input"
                />
                <div className="modal-buttons">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsIngredientModalOpen(false);
                      setEditingIngredient(null);
                      setNewIngredientName('');
                      setNewIngredientQuantity('');
                      setNewIngredientWhereToBuy('');
                    }} 
                    className="cancel-button"
                  >
                    <FormattedMessage id="button.cancel" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={!newIngredientName.trim() || !newIngredientQuantity.trim()}
                    className={`add-button ${!newIngredientName.trim() || !newIngredientQuantity.trim() ? 'disabled' : ''}`}
                  >
                    <FormattedMessage id={editingIngredient ? 'button.save' : 'button.add'} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {ingredientToDelete && (
          <div className="modal-overlay" onClick={handleModalOverlayClick}>
            <div className="modal delete-modal">
              <h2><FormattedMessage id="modal.deleteConfirm" /></h2>
              <p><FormattedMessage 
                id="modal.deleteIngredient" 
                values={{ name: ingredientToDelete.ingredient.name }} 
              /></p>
              <div className="modal-buttons">
                <button 
                  type="button" 
                  onClick={() => setIngredientToDelete(null)} 
                  className="cancel-button"
                >
                  <FormattedMessage id="button.cancel" />
                </button>
                <button 
                  type="button" 
                  onClick={handleRemoveIngredient} 
                  className="delete-confirm-button"
                >
                  <FormattedMessage id="button.delete" />
                </button>
              </div>
            </div>
          </div>
        )}

        {dateToDelete && (
          <div className="modal-overlay" onClick={handleModalOverlayClick}>
            <div className="modal delete-modal">
              <h2><FormattedMessage id="modal.deleteConfirm" /></h2>
              <p><FormattedMessage 
                id="modal.deleteDate" 
                values={{ date: formatDate(dateToDelete.date) }} 
              /></p>
              <div className="modal-buttons">
                <button 
                  type="button" 
                  onClick={() => setDateToDelete(null)} 
                  className="cancel-button"
                >
                  <FormattedMessage id="button.cancel" />
                </button>
                <button 
                  type="button" 
                  onClick={handleRemoveDate} 
                  className="delete-confirm-button"
                >
                  <FormattedMessage id="button.delete" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </IntlProvider>
  );
}

export default App; 