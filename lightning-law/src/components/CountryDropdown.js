import React from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css';

export default function CountryDropdown({ countryData, changeSelectedCountry, currentCountry }) {

    const handleCountryChange = (e) => {
        changeSelectedCountry(e.value)
    }

    return (
        <div>
            <Dropdown options={countryData} onChange={(e) => handleCountryChange(e)} value={currentCountry} placeholder={currentCountry === '' ? "Select Country from Dropdown" : currentCountry} />
        </div>
    )
}
