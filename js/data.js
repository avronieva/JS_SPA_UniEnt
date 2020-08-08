import {beginRequest, endRequest} from './notification.js'

function host(endpoint) {
    return `https://api.backendless.com/299E52E5-47E3-8077-FF5D-6FA7C92D4E00/661443E6-C12F-4E86-822D-7850509EB551/${endpoint}`
}

const endpoints = {
    REGISTER: "users/register",
    LOGIN: "users/login",
    LOGOUT: "users/logout",
    RECIPES: 'data/recipes',
    RECIPE_BY_ID: 'data/recipes/',
}

export async function register(firstName, lastName, username, password) {
    beginRequest();

    const result = (await fetch(host(endpoints.REGISTER), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName,
            lastName,
            username,
            password
        }) 
    })).json();

    endRequest();
    return result;
}

export async function login(username, password) {
    beginRequest();

    const result = await (await fetch(host(endpoints.LOGIN), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: username,
            password
        }) 
    })).json();

    sessionStorage.setItem('userToken', result['user-token']);
    sessionStorage.setItem('username', result.username);
    sessionStorage.setItem('userId', result.objectId);
    sessionStorage.setItem('names', `${result.firstName} ${result.lastName}`)

    endRequest();
    return result;
}

// не връща JSON / Promise и за това не я използваме с async await
export async function logout() {
    beginRequest();

    const token = sessionStorage.getItem('userToken');
    
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('names');
    

    const result = fetch(host(endpoints.LOGOUT), {
        headers: {
            'user-token': token
        }
    });

    endRequest();
    return result;
}


export async function getAllRecipes() {
    beginRequest();

    const token = sessionStorage.getItem('userToken');

    const result = (await fetch(host(endpoints.RECIPES), {
           headers: {
               'user-token': token
           }
       })).json();
    
    endRequest();
    return result;
}

export async function createRecipe(recipe) {
    beginRequest();

    const token = sessionStorage.getItem('userToken');

    const result = (await fetch(host(endpoints.RECIPES), {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'user-token': token
        },
        body: JSON.stringify(recipe)
    })).json();

    endRequest();
    return result;
}

export async function getRecipeById(id) {
    beginRequest();

    const token = sessionStorage.getItem('userToken');

    const result = (await fetch(host(endpoints.RECIPE_BY_ID + id), {
        headers: {
            'user-token': token
        }
    }
    )).json();

    endRequest();
    return result;
}


export async function updateRecipe(id, updatedProps) {
    beginRequest();

    const token = sessionStorage.getItem('userToken');

    const result = (await fetch(host(endpoints.RECIPE_BY_ID + id), {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'user-token': token
        },
        body: JSON.stringify(updatedProps)
    })).json();

    endRequest();
    return result;
}


export async function deleteRecipe(id) {
    beginRequest();

    const token = sessionStorage.getItem('userToken');

    const result = (await fetch(host(endpoints.RECIPE_BY_ID + id), {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'user-token': token
        }
    })).json();

    endRequest();
    return result;
}

export async function likeRecipe(recipe) {
    const newLikes = recipe.likes + 1;
    const recipeId = recipe.objectId;

    return updateRecipe(recipeId, { likes: newLikes });
}
