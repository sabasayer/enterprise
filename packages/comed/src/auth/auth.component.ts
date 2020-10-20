import { AuthLogic } from "./auth.logic";

export class AuthComponent {

    constructor() {
        this.signIn()
    }

    async signIn() {
        const result = await AuthLogic.instance.signIn({ username: 'ahmetar', password: '123456', tenantId: 1 });

        if (result.errorMessages) {
            alert(JSON.stringify(result.errorMessages));
            return;
        }

    }
}