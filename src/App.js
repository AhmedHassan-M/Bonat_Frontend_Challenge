import React, { useState, useEffect } from 'react';
import './App.scss';
import axios from 'axios';

function App() {

  const [faces, setFaces] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [scrollLoading, setScrollLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(true);
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    getFaces(true);
  }, [sortBy]);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollLoading);
    return () => window.removeEventListener('scroll', handleScrollLoading);
  });

  const getFaces = (init) => {
    if (init) setFaces([]);
    axios.get(
      `${process.env.REACT_APP_BACKENDURL}api/products?_limit=15&_page=${nextPage}${sortBy ? `&_sort=${sortBy}` : ''}`
    ).then(res => {
      setScrollLoading(false);
      incrementNextPage();
      const newFaces = res?.data || [];
      if (!newFaces?.length) {
        setLoadMore(false);
      } else {
        setFaces(prevState => init ? ([...newFaces]) : ([...prevState, ...newFaces]));
      }
    }).catch(err => {
      console.log(err);
      setScrollLoading(false);
    });
  };

  const incrementNextPage = () => setNextPage(prevState => prevState + 1);
  
  const formatPrice = price => `$${price / 100}`;

  const formatDate = date => {
    // can use moment.js
    const dateObj = new Date(date);
    const dayInMS = 86400000;
    const today = new Date();
    const daysSinceCreated = (today.getTime() - dateObj.getTime()) / dayInMS;
    if (!Math.floor(daysSinceCreated)) {
      return 'Today';
    } else if (daysSinceCreated < 7) {
      return `${Math.floor(daysSinceCreated)} ${daysSinceCreated < 2 ? 'day' : 'days'} ago`;
    } else {
      // can handle single digit numbers to be prefixed by a 0
      return `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
    }
  };

  /* START EVENT HANDLERS */

  const handleScrollLoading = () => {
    const remainingHeight = document.body.offsetHeight - (window.scrollY + window.innerHeight);
    if (remainingHeight > 0 || scrollLoading || !loadMore) return;
    setScrollLoading(true);
    getFaces();
  }

  const onClickFilter = (filter) => {
    setSortBy(prevState => prevState === filter ? null : filter);
    setScrollLoading(true);
    setNextPage(1);
  }

  /* END EVENT HANDLERS */

  /* START VIEW METHODS */

  const products = () => {
    return faces.map((face, i) => {
      const font = { fontSize: `${face.size}px` };
      return (
        <div className="col-md-4 col-sm-6 col-12 mb-3" key={face.id}>
          <div className="face-card">
            <div className="face-container">
              <p className="face" style={font}>{ face.face }</p>
            </div>
            <p className="face-price">{ formatPrice(face.price) }</p>
            <p className="face-date">{ formatDate(face.date) }</p>
          </div>
        </div>
      );
    })
  };

  const loader = () => {
    if (scrollLoading) {
      return (
        <div className="page-loading">
          <img src="images/spinner.gif" alt="" />
        </div>
      )
    }
  }

  const endOfCatalogue = () => {
    if (!loadMore) {
      return (
        <p className="col-12 end-text">~ end of catalogue ~</p>
      )
    }
  }

  /* END VIEW METHODS */

  return (
    <div className="container-fluid px-0">
      <div className="container py-3">
        <h1 className="text-center py-4">Products</h1>
        <div className="row">
          <div className="col-12 text-center">
            <h3 className="label">Filter By</h3>
            <div className="filters-row mb-3">
              <div className="checkboxes-container">
                <button className={`btn btn-checkbox ${sortBy === 'price' ? 'active' : ''}`} onClick={() => onClickFilter('price')}>
                  <span className="btn-label">Price</span>
                </button>
                <button className={`btn btn-checkbox ${sortBy === 'size' ? 'active' : ''}`} onClick={() => onClickFilter('size')}>
                  <span className="btn-label">Size</span>
                </button>
                <button className={`btn btn-checkbox ${sortBy === 'id' ? 'active' : ''}`} onClick={() => onClickFilter('id')}>
                  <span className="btn-label">ID</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          { products() }
          { loader() }
          { endOfCatalogue() }
        </div>
      </div>
    </div>
  );
}

export default App;
