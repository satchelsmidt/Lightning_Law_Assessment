import React, { useState, useEffect } from 'react';
import { getWine } from './api/getWine'

function App() {

  const [reviewData, setReviewData] = useState([])


  // const renderData = () => {
  //   // TODO: enable this again

  //   getWine().then((res) => {
  //     console.log('the response: ', res)
  //     let data = []
  //     for (let i of res.data) {
  //       data.push(i)
  //     }

  //     setReviewData(data)
  //   })
  // }

  const showData = () => {
    console.log('our data: ', reviewData)
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
    })
  }, [])

  if (reviewData.length === 0) {
    return <p>Loading Data</p>
  }


  return (
    <div className="App">
      <p> Hello </p>
      {/* <button onClick={() => renderData()}>Click Me</button> */}
      <button onClick={() => showData()}>Click Me</button>
    </div>
  );
}

export default App;
