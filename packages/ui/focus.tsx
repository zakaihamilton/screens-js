import screens from "../../lib/screens";
import React from 'react';

screens.UIFocus = function ({ focusId, children }: { focusId: string, children: any }) {
    const { UIFocus } = screens;
    UIFocus.me.CoreListener.register(UIFocus.name, "focusId", (state: any) => {
        state.order = state.order.filter((id: string) => id !== state.focusId);
        state.order.push(state.focusId);
    });
    let fields = UIFocus.useFields({ focusId });
    let elements = React.Children.toArray(children).map((element, index) => {
        return React.cloneElement(element, { index });
    });
    return (<UIFocus.Fields value={fields}>{elements}</UIFocus.Fields>);
};

screens.UIFocus.init = function () {
    const { UIField } = screens;
    UIField.create(this, {
        focusId: "",
        order: []
    });
};
