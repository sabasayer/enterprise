import { AuthLogic } from "./auth.logic";

export class AuthComponent {

    constructor() {
        this.signIn()
    }

    async signIn() {
        const result = await AuthLogic.instance.signIn({ username: 'ahmetar', password: '123456', tenantId: 1 });

        console.log('isAuthenticated', AuthLogic.instance.isAuthenticated);

        if (result.errorMessages) {
            alert(JSON.stringify(result.errorMessages));
            return;
        }

        document.body.innerHTML = JSON.stringify(result.data)
    }
}