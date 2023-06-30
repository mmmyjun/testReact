import './App.css';
import ToDo from './todo';
import Clock from './clock';
// import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  withRouter
} from "react-router-dom";
import TableFilter from './tableFilter'
import { Button } from "rsuite";

function App() {
  // const [showClock, setShowClock] = useState(false);
  return (
    // <>
    //   {
    //     showClock ? <Clock /> : <ToDo />
    //   }
    //   <div style={{ marginTop: 20 }}>
    //      <Button appearance="subtle" onClick={() => setShowClock(!showClock)}>显示 / 隐藏 时钟</Button>
    //   </div>
    // </>
    <div className="app">
      <Router>
        <Nav />
        <Route path="/" component={() => {
          return <TableFilter className="data-table" />
        }} exact />
        <Route path="/clock" render={
          () => (
            <div className="child">
              <Route path="/clock" component={Clock} exact />
              <Route path="/clock/todo" component={ToDo} />
            </div>
          )
        } />
      </Router>
    </div>
  );
}



const Nav = () => {
  return (
    <div className="nav">
      <CustomLink path="/">Table</CustomLink>
      <CustomLink path="/clock">Clock</CustomLink>
      <CustomLink path="/clock/todo">Todo</CustomLink>
    </div>
  )
}

const CustomLink = withRouter(({ path, children, history }) => { // primary
  return (
    <Button appearance={history.location.pathname === path ? 'primary' : 'subtle'} onClick={() => history.push(path)}>{children}</Button>
  )
})

export default App;
