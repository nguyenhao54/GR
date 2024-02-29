import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './structure';
import { Calendar, Dashboard } from './pages';

function App() {
  return (
   <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/calendar" element={<Calendar/>}></Route>
        </Route>
   </Routes>
  );  
}


export default App;
