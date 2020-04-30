import { ActionTypes } from 'const';

const initialState = {
    name: "",
    log_count: 0,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ActionTypes.SET_USER: {
            return Object.assign({}, state, {
                name: typeof action.name === "undefined" ?
                    state.name : action.name,
                    log_count: action.log_count || initialState.log_count,
            });
        }
        default:
            return state;
    }
}