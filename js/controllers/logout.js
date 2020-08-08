import {logout as apiLogout} from '../data.js'
import { showInfo, showError } from '../notification.js'

export default async function logout() {
    try {        
        const result = await apiLogout();
        // if (result.hasOwnProperty('errorData')) {
        //     const error = new Error();
        //     Object.assign(error, result);
        //     throw error;
        // }
        this.app.userData.username = '';
        this.app.userData.userId = '';
        this.app.userData.names = '';

        showInfo('Logout successfull!')

        this.redirect('#/home');
    } catch (err) {
        showError(err.message);
    }
}