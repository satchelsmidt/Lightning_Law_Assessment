import React from 'react'

export default function TotalReviewsBox({ selectedCountryReviews }) {
    return (
        <div>
            <p>Total Reviews: {selectedCountryReviews.length}</p>
        </div>
    )
}
