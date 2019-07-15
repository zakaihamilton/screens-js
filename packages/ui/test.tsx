import screens from "../../lib/screens";
import React, { useState } from 'react';

screens.UITest = function () {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);
    const { UITest } = screens;
    return (
        <div>
            <UITest.Child></UITest.Child>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
      </button>
        </div>
    );
}

screens.UITest.Child = function () {
    return (
        <div>This works as well</div>
    )
}