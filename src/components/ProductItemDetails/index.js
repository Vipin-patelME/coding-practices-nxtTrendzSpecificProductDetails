// Write your code here
import {Component} from 'react'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetail extends Component {
  state = {
    itemDetail: [],
    apiStatus: apiStatusConstants.initial,
    similarProductData: [],
    count: 1,
  }

  componentDidMount() {
    this.findProductDetails()
  }

  findProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const similarProduct = fetchedData.similar_products.map(eachProduct => ({
        imageUrl: eachProduct.image_url,
        brand: eachProduct.brand,
        price: eachProduct.price,
        rating: eachProduct.rating,
        title: eachProduct.title,
        id: eachProduct.id,
      }))
      const updatedData = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        rating: fetchedData.rating,
        title: fetchedData.title,
        price: fetchedData.price,
        totalReviews: fetchedData.total_reviews,
      }
      this.setState({
        itemDetail: updatedData,
        apiStatus: apiStatusConstants.success,
        similarProductData: similarProduct,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onDecreaseCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    } else {
      this.setState({count: 1})
    }
  }

  onIncreaseCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onRenderProductItemDetail = () => {
    const {itemDetail, count} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      title,
      rating,
      price,
      totalReviews,
    } = itemDetail
    return (
      <div className="product-detail-cont">
        <img src={imageUrl} alt="product" className="image-style" />
        <div className="description-cont">
          <h1>{title}</h1>
          <p>{`RS ${price}/-`}</p>
          <div>
            <p className="star-para">
              {rating}
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="start-img"
              />
            </p>
            <p>{totalReviews}</p>
          </div>
          <p>{description}</p>
          <p>{`Available: ${availability}`}</p>
          <p>{`Brand: ${brand}`}</p>
          <div className="button-cont">
            <button type="button" testid="minus" onClick={this.onDecreaseCount}>
              <BsDashSquare />
            </button>
            <p>{count}</p>
            <button type="button" testid="plus" onClick={this.onIncreaseCount}>
              <BsPlusSquare />
            </button>
          </div>
          <button className="add-btn" type="button">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  onRenderSimilarProduct = () => {
    const {similarProductData} = this.state
    return (
      <div>
        <h1>Similar Products</h1>
        <ul className="similar-product-cont">
          {similarProductData.map(data => (
            <SimilarProductItem similarData={data} key={data.id} />
          ))}
        </ul>
      </div>
    )
  }

  onReRenderShopping = () => {
    const {history} = this.props
    history.push('/products/')
  }

  renderProductsListView = () => (
    <div>
      <Header />
      {this.onRenderProductItemDetail()}
      <div>{this.onRenderSimilarProduct()}</div>
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">Product not Found</h1>
      <button
        type="button"
        className="shopping-btn"
        onClick={this.onReRenderShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return this.renderAllProducts()
  }
}
export default ProductItemDetail
