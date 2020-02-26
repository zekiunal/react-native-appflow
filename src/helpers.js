import React, {useReducer, createRef} from 'react';

export const navigationRef = createRef();

export function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}

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

export function withProvider(Context, props, actions, state, dispatch) {
    const boundActions = {};
    for (let key in actions) {
        if (actions.hasOwnProperty(key)) {
            boundActions[key] = actions[key](dispatch);
        }
    }

    return (
        <Context.Provider value={{state, ...boundActions, ...props}} {...props}>
            {props.children}
        </Context.Provider>
    );
}

export function withInject(Context, InjectContext, props, actions, state, dispatch) {
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
                                ...boundActions, ...injectedProps, ...props,
                                state: Object.assign({}, injectedProps.state, state,)
                            }} {...props}>
                            {props.children}
                        </Context.Provider>
                    );
                }
            }
        </InjectContext.Consumer>
    )
}

export default function createDataContext(Context, reducer, actions, default_state, InjectContext = false) {

    const Provider = (props) => {
        console.log(props);
        const [state, dispatch] = useReducer(reducer, default_state);

        return (!InjectContext) ?
            withProvider(Context, props, actions, state, dispatch)
            :
            withInject(Context, InjectContext, props, actions, state, dispatch)
    };

    return {Provider, Context};
};
