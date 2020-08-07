import React, { useState, useEffect } from 'react';
import { getWine } from './api/getWine'
import { BallBeat } from 'react-pure-loaders';
import ReviewData from './ReviewData.json'
import ReactPaginate from 'react-paginate'
import CountryDropdown from './components/CountryDropdown'
import TotalReviewsBox from './components/TotalReviewsBox'
import ReviewTable from './components/ReviewTable'


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


  //TODO: reenable this eventually
  //Effect hook runs once on page load, grabs data
  // useEffect(() => {
  //   getWine().then((res) => {
  //     console.log('the response: ', res)
  //     let data = []
  //     for (let i of res.data) {
  //       data.push(i)
  //     }

  //     setReviewData(data)
  //     setLoading(false)
  //   })
  // }, [])


  //hook to grab review data initially
  useEffect(() => {
    // if (localStorage.getItem('ReviewData') !== null) {
    //   console.log('country: ', setSelectedCountry(localStorage.getItem('SelectedCountry') || '')
    //   )
    //   getInitialState()
    //   setLoading(false)
    // }
    // else {
    setReviewData(ReviewData)
    // localStorage.setItem('ReviewData', ReviewData);
    setLoading(false)
    // }
  }, [])


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
    <div className="App">
      <CountryDropdown countryData={countries} changeSelectedCountry={(country) => changeSelectedCountry(country)} currentCountry={selectedCountry}></CountryDropdown>
      <TotalReviewsBox selectedCountryReviews={selectedCountryReviews}></TotalReviewsBox>
      <br></br>
      {selectedCountryReviews.length > 0 && <input type="text" value={searchTerm} placeholder={'Search for Reviews'} onChange={(e) => setSearchTerm(e.target.value)}></input>}
      {selectedCountryReviews.length > 0 && <button onClick={() => handleSearch()}>Search</button>}
      {searchTerm && <button onClick={() => handleClear()}>Clear Filter</button>}
      <br></br>
      {selectedCountryReviews.length > 0 && <ReviewTable selectedCountryReviews={selectedCountryReviews} handlePageClick={(e) => handlePageClick(e)} offset={offset} perPage={perPage} pageCount={pageCount}></ReviewTable>}
    </div>
  );
}