import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('recipes');
    if (saved) {
      try {
        setRecipes(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recipes:', e);
      }
    }
    setLoading(false);
  }, []);

  const saveRecipes = (updatedRecipes) => {
    setRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
  };

  const parseRecipeHTML = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const recipe = {
      id: Date.now(),
      name: doc.querySelector('[itemprop="name"]')?.textContent?.trim() || 'Unnamed Recipe',
      categories: doc.querySelector('[itemprop="recipeCategory"]')?.textContent?.trim() || '',
      servings: doc.querySelector('[itemprop="recipeYield"]')?.textContent?.trim() || '',
      rating: doc.querySelector('.rating')?.textContent?.trim() || '★★★★★',
      ingredients: Array.from(doc.querySelectorAll('[itemprop="recipeIngredient"]')).map(el => el.textContent.trim()),
      directions: Array.from(doc.querySelectorAll('.directions p')).map(el => el.textContent.trim()).filter(text => text.length > 0),
      nutrition: doc.querySelector('.nutrition')?.textContent?.trim() || '',
      source: doc.querySelector('[itemprop="url"]')?.href || '',
    };

    return recipe;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    let successCount = 0;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const recipe = parseRecipeHTML(event.target.result);
          setRecipes(prev => {
            const updated = [...prev, recipe];
            localStorage.setItem('recipes', JSON.stringify(updated));
            return updated;
          });
          successCount++;
        } catch (error) {
          console.error('Error parsing recipe:', error);
        }
      };
      reader.readAsText(file);
    });
    
    e.target.value = '';
  };

  const deleteRecipe = (id) => {
    saveRecipes(recipes.filter(r => r.id !== id));
    if (selectedRecipe?.id === id) {
      setSelectedRecipe(null);
    }
  };

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
    r.categories.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading recipes…</div>;
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Recipe Box</h1>
          <input
            type="text"
            placeholder="Search recipes…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="upload-section">
          <label className="upload-label">
            <input
              type="file"
              multiple
              accept=".html"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <span className="upload-button">
              <i className="fas fa-upload"></i>
              Add recipes
            </span>
          </label>
        </div>

        <div className="recipes-list">
          {filteredRecipes.length === 0 ? (
            <div className="empty-list">
              {recipes.length === 0 ? 'Upload your first recipe' : 'No recipes match'}
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className={`recipe-item ${selectedRecipe?.id === recipe.id ? 'active' : ''}`}
              >
                <div className="recipe-item-name">{recipe.name}</div>
                {recipe.categories && <div className="recipe-item-category">{recipe.categories}</div>}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {selectedRecipe ? (
          <article className="recipe-detail">
            <div className="recipe-header">
              <div>
                <h1>{selectedRecipe.name}</h1>
                <div className="recipe-meta">
                  <span>{selectedRecipe.rating}</span>
                  {selectedRecipe.categories && <span>{selectedRecipe.categories}</span>}
                  {selectedRecipe.servings && <span>{selectedRecipe.servings}</span>}
                </div>
              </div>
              <button
                onClick={() => deleteRecipe(selectedRecipe.id)}
                className="delete-button"
              >
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>

            {selectedRecipe.ingredients.length > 0 && (
              <section className="recipe-section">
                <h2>Ingredients</h2>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </section>
            )}

            {selectedRecipe.directions.length > 0 && (
              <section className="recipe-section">
                <h2>Directions</h2>
                <ol className="directions-list">
                  {selectedRecipe.directions.map((direction, idx) => (
                    <li key={idx}>{direction}</li>
                  ))}
                </ol>
              </section>
            )}

            {selectedRecipe.nutrition && (
              <section className="recipe-section nutrition-section">
                <h3>Nutrition</h3>
                <div className="nutrition-info">{selectedRecipe.nutrition}</div>
              </section>
            )}
          </article>
        ) : (
          <div className="empty-state">
            <i className="fas fa-book"></i>
            <p>Select a recipe or upload one to start</p>
            <small>Drag HTML files from your recipe collection</small>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
