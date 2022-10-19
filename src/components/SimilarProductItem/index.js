// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarData} = props
  const {id, title, rating, price, brand, imageUrl} = similarData

  return (
    <li className="item-cont">
      <img
        src={imageUrl}
        alt={`similar product ${id}`}
        className="similar-image"
      />
      <p>{title}</p>
      <p>{`by ${brand}`}</p>
      <div className="price-rating-cont">
        <p>{`Rs ${price}/-`}</p>
        <div>
          <button type="button" className="star-para">
            {rating}
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="start-img"
            />
          </button>
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
