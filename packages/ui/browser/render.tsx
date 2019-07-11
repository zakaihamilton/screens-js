import screens from "../../../lib/screens";
import ReactDOM from 'react-dom';
import React from 'react';

screens.UIRender = function () {

};

screens.UIRender.component = async (component: string) => {
    let Component = screens[component];
    ReactDOM.hydrate(<Component />, document.getElementById("react"), undefined);
};
