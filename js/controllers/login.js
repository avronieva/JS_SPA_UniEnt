import { login as apiLogin} from '../data.js'
import { showInfo, showError } from '../notification.js';

export default async function login() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    };

    this.partial('./templates/user/login.hbs');
}

export async function loginPost() {
    try {        
        const result = await apiLogin(this.params.username, this.params.password);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error;
        }

        this.app.userData.username = result.username;
        this.app.userData.userId = result.objectId;
        this.app.userData.names = `${result.firstName} ${result.lastName}`;

        showInfo(`Login successful`);

        this.redirect('#/home');
    } catch (err) {
        console.log(err);
        showError(err.message)
    }
}