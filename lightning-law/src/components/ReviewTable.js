import React from 'react'
import ReactPaginate from 'react-paginate'

export default function ReviewsTable({ selectedCountryReviews, offset, perPage, handlePageClick, pageCount }) {

    const slicedReviews = selectedCountryReviews.slice(offset, (offset + perPage))

    const nextPageClick = (e) => {
        handlePageClick(e)
    }

    const renderTableData = () => {
        return slicedReviews.map((review) => {
            return <tr key={review.title} style={styles.tableRow}>
                <td>{review.title ? review.title : 'N/A'}</td>
                <td>{review.variety ? review.variety : 'N/A'}</td>
                <td>{review.winery ? review.winery : 'N/A'}</td>
                <td>{review.points ? review.points : 'N/A'}</td>
                <td>{review.price ? review.price : 'N/A'}</td>
                <td>{review.designation ? review.designation : 'N/A'}</td>
            </tr>
        })
    }

    return (
        <div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Title</th>
                            <th>Variety</th>
                            <th>Winery</th>
                            <th>Points</th>
                            <th>Price</th>
                            <th>Description</th>
                        </tr>
                        {renderTableData()}
                    </tbody>
                </table>
            </div>
            <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(e) => nextPageClick(e)}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />
        </div>
    )
}

const styles = {
    tableRow: {
        'margin': '10px'
    }
}