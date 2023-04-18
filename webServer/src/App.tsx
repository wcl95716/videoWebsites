import React, { useEffect } from 'react';
import './App.css';
import { store } from './store';
import { Provider } from 'react-redux';
import { ModifyJson } from './componens/modifyJson';
import { Pasteboard } from './componens/pasteboard';
import {VideoList} from './componens/playVideo/test';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>copilot1</h1>
        <br/>
        <VideoList/>
        {/* <ModifyJson/> */}
      </div>
    </Provider>

  );
}

export default App;
