import { register as apiRegister, login} from '../data.js'
import { showInfo, showError } from '../notification.js';

export default async function register() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    this.partial('./templates/user/register.hbs', this.app.userData);
}

export async function registerPost() {
    try {
    
        if(this.params.firstName.length < 2) { 
            throw new Error('First name must be atleast 2 characters long')    
        }
        if(this.params.lastName.length < 2) { 
            throw new Error('Last name must be atleast 2 characters long')    
        }
        if(this.params.username.length < 3) { 
            throw new Error('Username must be atleast 3 characters long')    
        }
        if(this.params.password.length < 6) { 
            throw new Error('Password must be atleast 6 characters long')    
        }
        if (this.params.password !== this.params.repeatPassword) {
            throw new Error('Password does not match');
        }

        const result = await apiRegister(this.params.firstName, this.params.lastName, this.params.username, this.params.password);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        const loginResult = await login(this.params.username, this.params.password);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        this.app.userData.names = `${loginResult.firstName} ${loginResult.lastName}`;
        this.app.userData.username = loginResult.username;
        this.app.userData.userId = loginResult.objectId;

        showInfo('Successfully registerd');

        this.redirect('#/home');
    } catch (err) {
        console.log(err);
        showError(err.message);
    }
}