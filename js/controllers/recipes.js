import { createRecipe, getAllRecipes, likeRecipe as apiLikeRecipe, getRecipeById, updateRecipe, deleteRecipe as apiDeleteRecipe } from '../data.js'
import { showInfo, showError } from '../notification.js';

// catalog on the home page!
export default async function home() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        catalog: await this.load('./templates/catalog/catalog.hbs'),
        recipe: await this.load('./templates/catalog/recipe.hbs'),
    };

    const context = Object.assign({}, this.app.userData)

    if (this.app.userData.username) {
        const recipes = await getAllRecipes();
        context.recipes = recipes;
    }

    this.partial('./templates/home.hbs', context);
}


export async function create() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    this.partial('./templates/catalog/create.hbs', this.app.userData);
}

const categories = {
    'Vegetables and legumes/beans': 'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg',
    'Fruits': 'https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg',
    'Grain Food': 'https://snackymatz.com/wp-content/uploads/2017/03/corn-syrup-563796__340-300x200.jpg',
    'Milk, cheese, eggs and alternatives': 'https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg',
    'Lean meats and poultry, fish and alternatives': 'https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg'
};


export async function createPost() {
    const recipe = {
        meal: this.params.meal,
        ingredients: this.params.ingredients.split(', ').map(i => i.trim()),
        prepMethod: this.params.prepMethod,
        description: this.params.description,
        foodImageURL: this.params.foodImageURL,
        category: this.params.category,
        likes: 0,
    }

    const category = recipe.category;
    recipe['categoryImageURL'] = categories[category];

    try {
        if (recipe.meal.length < 4) {
            throw new Error('Mael name must be atleast 4 characters long')
        }
        if (recipe.ingredients.length < 2) {
            throw new Error('Ingredients must be at least 2')
        }
        if (recipe.prepMethod.length < 10) {
            throw new Error('Preparation method must be atleast 10 characters long')
        }
        if (recipe.description.length < 10) {
            throw new Error('Description must be atleast 10 characters long')
        }
        if (recipe.foodImageURL.slice(0, 7) !== 'http://' && recipe.foodImageURL.slice(0, 8) !== 'https://') {
            throw new Error('Invalid food image URL')
        }

        const result = await createRecipe(recipe);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Successfully created recipe');

        this.redirect('#/details/' + result.objectId);
    } catch (err) {
        console.log(err);
        showError(err.message);
    }
}


export async function edit() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };


    const recipe = await getRecipeById(this.params.id);
    recipe.ingredients = recipe.ingredients.join(', ');
    const context = Object.assign({recipe}, this.app.userData);
    
    await this.partial('./templates/catalog/edit.hbs', context);

}

export async function editPost() {
    const id = this.params.id;
    let recipe = await getRecipeById(id);

    recipe.meal = this.params.meal;
    recipe.ingredients = this.params.ingredients.split(', ').map(i => i.trim());
    recipe.prepMethod = this.params.prepMethod;
    recipe.description = this.params.description;
    recipe.foodImageURL = this.params.foodImageURL;
    recipe.category = this.params.category;
    recipe.likes = 0;
    
    const category = recipe.category;
    recipe['categoryImageURL'] = categories[category];

    try {
        if (recipe.meal.length < 4) {
            throw new Error('Mael name must be atleast 4 characters long')
        }
        if (recipe.ingredients.length < 2) {
            throw new Error('Ingredients must be at least 2')
        }
        if (recipe.prepMethod.length < 10) {
            throw new Error('Preparation method must be atleast 10 characters long')
        }
        if (recipe.description.length < 10) {
            throw new Error('Description must be atleast 10 characters long')
        }
        if (recipe.foodImageURL.slice(0, 7) !== 'http://' && recipe.foodImageURL.slice(0, 8) !== 'https://') {
            throw new Error('Invalid food image URL')
        }
        if (recipe.category == 'Select category...') {
            throw new Error('Please select category form the list')
        }

        const result = await updateRecipe(id, recipe);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo('Successfully edited recipe');

        this.redirect('#/details/' + result.objectId);
    } catch (err) {
        console.log(err);
        showError(err.message);
    }

}

export async function details() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),

    };

    const id = this.params.id;
    const recipe = await getRecipeById(id);
    const context = Object.assign({ recipe }, this.app.userData)

    if (recipe.ownerId === this.app.userData.userId) {
        recipe.canEdit = true;
    }

    await this.partial('./templates/catalog/details.hbs', context);
}

export async function likeRecipe() {
    const id = this.params.id;  
    let recipe = await getRecipeById(id);

    try {
        const result = await apiLikeRecipe(recipe);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo(`Successfully liked recipe`);
        this.redirect('#/home');
    } catch (err) {
        console.log(err);
        showError(err.message);
    }
}

export async function deleteRecipe() {
    if (confirm("Are you shure you want to delete this recipe?") == false) {
        return this.redirect('#/my_recipes');
    }

    const id = this.params.id;

    try {
        const result = await apiDeleteRecipe(id);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        showInfo(`Successfully deleted recipe`);
        this.redirect('#/home');
    } catch (err) {
        console.log(err);
        showError(err.message);
    }

}