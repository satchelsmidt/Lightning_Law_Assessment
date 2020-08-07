import React, { useState, useEffect } from 'react';
import { getWine } from './api/getWine'
import { BallBeat } from 'react-pure-loaders';
import ReviewData from './ReviewData.json'
import CountryDropdown from './components/CountryDropdown'
import TotalReviewsBox from './components/TotalReviewsBox'
import ReviewTable from './components/ReviewTable'
import Dropdown from 'react-dropdown'


export default function App() {

  const [reviewData, setReviewData] = useState([])
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCountryReviews, setSelectedCountryReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(true)

  // //pagination data
  const [offset, setOffset] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [pageCount, setPageCount] = useState(null)


  //TODO: make this functional
  // const getInitialState = () => {
  //   setReviewData(localStorage.getItem('ReviewData') || [])
  //   // setCountries(localStorage.getItem('Countries') || [])
  //   setSelectedCountry(localStorage.getItem('SelectedCountry') || '')
  //   setSelectedCountryReviews(localStorage.getItem('SelectedCountryReviews') || [])

  //   setOffset(localStorage.getItem('Offset') || 0)
  //   setPerPage(localStorage.getItem('PerPage') || 10)
  //   setPageCount(localStorage.getItem('PageCount') || null)
  // }


  //Function that runs when country selected from dropdown
  const changeSelectedCountry = (country) => {
    setSelectedCountry(country)
    // localStorage.setItem('SelectedCountry', country);
  }


  //Function that runs to filter reviews by selected country
  const filterReviews = () => {
    let countryReviews = reviewData.filter((review) => {
      return review.country === selectedCountry
    })

    setPageCount(Math.ceil(countryReviews.length / perPage))
    // localStorage.setItem('PageCount', countryReviews.length / perPage);

    setSelectedCountryReviews(countryReviews)
    // localStorage.setItem('SelectedCountryReviews', countryReviews);
  }


  //handle a click of the page
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * perPage;

    setOffset(offset)
    // localStorage.setItem('Offset', offset);
  };


  //handle search term
  const handleSearch = () => {

    let searchedReviews = selectedCountryReviews.filter((review) => {
      return (
        review.title === searchTerm ||
        review.variety === searchTerm ||
        review.winery === searchTerm ||
        review.designation === searchTerm
      )
    })

    setPageCount(Math.ceil(searchedReviews.length / perPage))
    setSelectedCountryReviews(searchedReviews)
  }


  //handle clear search term
  const handleClear = () => {

    setSearchTerm('')
    filterReviews()
  }

  const handleCountChange = (e) => {
    console.log('this is e: ', e)
    setPerPage(parseInt(e.value))
  }


  // Effect hook runs once on page load, grabs data
  useEffect(() => {
    getWine().then((res) => {
      console.log('the response: ', res)
      let data = []
      for (let i of res.data) {
        data.push(i)
      }

      setReviewData(data)
      setLoading(false)
    })
  }, [])



  //NOTE: This is only in place to grab data from local json file, not used in production or if api link is running smoothly

  //hook to grab review data initially
  // useEffect(() => {
  //   // if (localStorage.getItem('ReviewData') !== null) {
  //   //   console.log('country: ', setSelectedCountry(localStorage.getItem('SelectedCountry') || '')
  //   //   )
  //   //   getInitialState()
  //   //   setLoading(false)
  //   // }
  //   // else {
  //   setReviewData(ReviewData)
  //   // localStorage.setItem('ReviewData', ReviewData);
  //   setLoading(false)
  //   // }
  // }, [])
  //



  //hook to parse out countries (runs when review data is fetched)
  useEffect(() => {
    let uniqueCountries = new Set()
    for (let review of reviewData) {
      if (review.country !== null) {
        uniqueCountries.add(review.country)
      }
    }

    let uniqueCountriesArray = Array.from(uniqueCountries)

    setCountries(uniqueCountriesArray)
    // localStorage.setItem('Countries', uniqueCountriesArray);
  }, [reviewData])


  //hook to run when we change our selected country
  useEffect(() => {
    filterReviews()

  }, [selectedCountry])


  //Component to render when data is being fetched
  if (loading === true) {
    return <div>
      <h1>Fetching Wine Reviews</h1>
      <BallBeat
        color={'#123abc'}
        loading={loading}
      />
    </div>
  }

  //Component to render when data is done fetching
  return (
    <div className="App" style={styles.mainContainer}>

      <div className="TopContainer" style={styles.topContainer}>
        <div className="innerContainer" style={styles.innerContainer}>
          <TotalReviewsBox selectedCountryReviews={selectedCountryReviews}></TotalReviewsBox>
        </div>
        <div className="innerContainer" style={styles.innerContainer}>
          <CountryDropdown countryData={countries} changeSelectedCountry={(country) => changeSelectedCountry(country)} currentCountry={selectedCountry}></CountryDropdown>
        </div>
      </div>

      <br></br>

      <div className="Bottom Container" style={styles.bottomContainer}>
        <div className="TopContainer" style={styles.topContainer}>

          <div className="innerContainer" style={styles.innerContainer}>
            {selectedCountryReviews.length > 0 && <input type="text" value={searchTerm} placeholder={'Search for Reviews'} onChange={(e) => setSearchTerm(e.target.value)}></input>}
          </div>

          <div className="innerContainer" style={styles.innerContainer}>
            {selectedCountryReviews.length > 0 && <button onClick={() => handleSearch()}>Search</button>}
          </div>

          <div className="innerContainer" style={styles.innerContainer}>
            {searchTerm && <button onClick={() => handleClear()}>Clear Filter</button>}
          </div>

          <div className="innerContainer" style={styles.innerContainer}>
            {selectedCountryReviews.length > 0 && <p>Reviews per Page (style not applying correctly, but works): </p>}
            {selectedCountryReviews.length > 0 && <div>
              <Dropdown options={['10', '20', '30', '50', '100']} onChange={(e) => handleCountChange(e)} value={perPage} placeholder='Reviews per Page' /></div>}
          </div>

        </div>
        <br></br>
        {selectedCountryReviews.length > 0 && <ReviewTable selectedCountryReviews={selectedCountryReviews} handlePageClick={(e) => handlePageClick(e)} offset={offset} perPage={perPage} pageCount={pageCount}></ReviewTable>}
      </div>
    </div>
  );
}

const styles = {
  mainContainer: {
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'center',
    'justifyContent': 'center',
  },
  topContainer: {
    'display': 'flex',
    'flexDirection': 'row',
    'alignItems': 'center',
    'justifyContent': 'center',
  },
  bottomContainer: {
    'display': 'flex',
    'flexDirection': 'column',
    'alignItems': 'center',
    'justifyContent': 'center',
  },
  innerContainer: {
    'margin': '30px'
  }
}