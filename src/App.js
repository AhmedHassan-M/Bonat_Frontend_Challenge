import './App.scss';
import axios from 'axios';

axios.get(`${process.env.REACT_APP_BACKENDURL}api/products`).then(res => console.log(res)).catch(err => console.log(err));

function App() {
  return (
    <div className="container-fluid px-0">
      <div className="container py-3">
        <h1>Test React is working!</h1>
      </div>
    </div>
  );
}

export default App;
