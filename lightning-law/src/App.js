import React, { useState, useEffect } from 'react';
import { getWine } from './api/getWine'
import { BallBeat } from 'react-pure-loaders';

import CountryDropdown from './components/CountryDropdown'
import TotalReviewsBox from './components/TotalReviewsBox'


export default function App() {

  const [reviewData, setReviewData] = useState([])
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCountryReviews, setSelectedCountryReviews] = useState([])

  const [loading, setLoading] = useState(true)

  const showData = () => {
    console.log('our data: ', reviewData)
    console.log('our COUNTRIES: ', countries)
    console.log('our Country Selected: ', selectedCountry)
    console.log('our Country REVIEWS: ', selectedCountryReviews)
  }


  //Function that runs when country selected from dropdown
  const changeSelectedCountry = (country) => {
    setSelectedCountry(country)
  }


  //Function that runs to filter reviews by selected country
  const filterReviews = () => {
    let countryReviews = reviewData.filter((review) => {
      return review.country === selectedCountry
    })

    setSelectedCountryReviews(countryReviews)
  }


  //Effect hook runs once on page load, grabs data
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


  //hook to parse out countries (runs when review data is fetched)
  useEffect(() => {
    let uniqueCountries = new Set()
    for (let review of reviewData) {
      if (review.country !== null) {
        uniqueCountries.add(review.country)
      }
    }

    setCountries(Array.from(uniqueCountries))
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
      <button onClick={() => showData()}>Click Me</button>
    </div>
  );
}