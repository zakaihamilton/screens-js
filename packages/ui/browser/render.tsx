import screens from "../../../lib/screens";
import ReactDOM from 'react-dom';
import React, { useState } from 'react';

screens.UIRender = function () {
    this.component = async (Component: any) => {
        ReactDOM.hydrate(Component, null, undefined);
    };
};
