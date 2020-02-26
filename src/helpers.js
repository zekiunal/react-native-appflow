import React, {useReducer, createContext} from 'react';

export function createNavigator(Stack, Provider = false) {
    if (Provider) {
        return (
            <Provider>
                <Stack/>
            </Provider>
        );
    }

    return (<Stack/>);
};

export function withProvider(Context, children, actions, state, dispatch) {
    const boundActions = {};
    for (let key in actions) {
        if (actions.hasOwnProperty(key)) {
            boundActions[key] = actions[key](dispatch);
        }
    }

    return (
        <Context.Provider value={{state, ...boundActions}}>
            {children}
        </Context.Provider>
    );
}

export function withInject(Context, InjectContext, children, actions, state, dispatch) {
    const boundActions = {};
    return (
        <InjectContext.Consumer>
            {
                (injectedProps) => {
                    console.log(injectedProps);
                    for (let key in actions) {
                        if (actions.hasOwnProperty(key))
                            boundActions[key] = actions[key](dispatch, injectedProps);
                    }

                    return (
                        <Context.Provider
                            value={{
                                ...boundActions, ...injectedProps,
                                state: Object.assign({}, injectedProps.state, state)
                            }}>
                            {children}
                        </Context.Provider>
                    );
                }
            }
        </InjectContext.Consumer>
    )
}

export default function createDataContext(reducer, actions, default_state, InjectContext = false) {

    const Context = createContext({});

    const Provider = (props) => {
        const [state, dispatch] = useReducer(reducer, default_state);

        return (!InjectContext) ?
            withProvider(Context, props.children, actions, state, dispatch)
            :
            withInject(Context, InjectContext, props.children, actions, state, dispatch)
    };

    return {Provider, Context};
};
