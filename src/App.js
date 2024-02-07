import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Form from "./components/Form";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" component={Form} />
              <Route path="/app" component={Form} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
