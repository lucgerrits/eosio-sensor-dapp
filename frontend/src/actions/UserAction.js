import { ActionTypes } from 'const';

class UserAction {

    static setUser({ name, log_count }) {
        return {
            type: ActionTypes.SET_USER,
            name,
            log_count,
        }
    }

}

export default UserAction;