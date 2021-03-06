import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import { MDBPageItem, MDBPageNav, MDBRow, MDBCol, MDBPagination } from "mdbreact"

import { urlApi } from '../../3.helpers/database'
import { navItemChange } from '../../redux/1.actions'

// IMPORT COMPONENTS //
import LoadingScreen from '../../2.components/Loadings/loadingScreen'
import Carousel from '../../2.components/Carousel/Carousel'


class allMovies extends Component {
    _isMounted = false

    state = {
        moviePoster: [],
        moviePosterNew: [],
        itemsPerPage: 30,
        activePage: 1,
        isLoading: false
    }

    // PAGINATION PAGE CHANGE //
    pageChange = (action) => {
        let currentPage = this.state.activePage

        if (action === 'next') {
            this.setState({ activePage: currentPage + 1 })
            currentPage += 1
        } else if (action === 'prev') {
            this.setState({ activePage: currentPage - 1 })
            currentPage -= 1
        }

        axios.post(urlApi + 'movie/moviePoster', {
            limit: this.state.itemsPerPage,
            offset: this.state.itemsPerPage * (currentPage - 1)
        }).then(res => {
            if (this._isMounted) {
                console.log(res.data)
                this.setState({ moviePoster: res.data })
            }
            window.scrollTo(0,0)
        }).catch(err => {
            console.log(err)
        })
    }
    // PAGINATION PAGE CHANGE //

    // LIFECYCLE //
    componentDidMount() {
        this._isMounted = true
        window.scrollTo(0, 0)
        
        this.getMoviePosterNew()
        this.getMoviePoster()
        this.props.navItemChange('MOVIES')
    }

    componentWillUnmount() {
        this._isMounted = false
    }
    // LIFECYCLE //
    

    // GET POSTER //
    getMoviePoster = () => {
        this.setState({isLoading: true})
        axios.post(urlApi + 'movie/moviePoster', {
            limit: this.state.itemsPerPage,
            offset: this.state.itemsPerPage * (this.state.activePage - 1)
        }).then((res) => {
            if (this._isMounted) {
                this.setState({ moviePoster: res.data, isLoading: false })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    getMoviePosterNew = () => {
        axios.post(urlApi + 'movie/moviePosterNew')
            .then((res) => {
                if (this._isMounted) {
                    console.log(res.data)
                    this.setState({ moviePosterNew: res.data })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    // GET POSTER //

    // RENDERS //
    renderAllMovies = () => {
        let jsx = this.state.moviePoster.map(val => {
            return (
                <Link to={`/movie-details/${val.id}`} key={val.id}
                    className='card rounded text-decoration-none bg-transparent m-3'
                    style={{ width:'170px', height:'250px' }}>
                    <img src={val.poster} className='rounded' width='170px' height='250px' alt={`[POSTER] ${val.movieName}`} />
                        {
                            val.type === 'F'
                            ?
                                <span className='badge-dark text-center mt-n2 rounded-bottom' style={{ width: '170px', letterSpacing: '2px', fontSize: '11px', fontWeight: 'bold' }}>
                                    FREE
                                </span>
                            :
                                <span className='btn-purple text-center mt-n2 rounded-bottom' style={{ width: '170px', letterSpacing: '2px', fontSize: '11px', fontWeight: 'bold' }}>
                                    PREMIUM
                                </span>
                        }
                        
                </Link>
            )
        })
        return jsx
    }
    // RENDERS //


    render() {
        // LOADING //
        if (this.state.isLoading) {
            return <LoadingScreen />
        }
        // LOADING //

        return (
            <div className='page main-backdrop pb-5'>
                {/* Top Spacing Purpose */}
                <h1 className='mb-5'>&nbsp;</h1>
                {/* Top Spacing Purpose */}

                {/* New Uploads */}
                <div className='py-3'>
                    <div className="container-fluid mb-n1">
                        <h4 className='ml-4 pb-2 white-text text-center text-uppercase'>
                            Latest Uploads
                        </h4>
                    </div>
                    <div className='border-bottom border-top'>
                        {
                            this.state.moviePosterNew.length > 0
                            ?
                            <Carousel moviePoster={this.state.moviePosterNew} />
                            :
                            null
                        }
                    </div>
                </div>
                {/* New Uploads */}

                {/* ALL MOVIES */}
                <div className="container-fluid p-5">
                    <div className="row justify-content-center">
                        {this.renderAllMovies()}
                    </div>
                </div>
                {/* ALL MOVIES */}

                {/* PAGINATION */}
                <div className="container px-5">
                    <MDBRow className='bg-light pt-3 rounded-pill'>
                        <MDBCol className='d-flex justify-content-center'>

                            <MDBPagination color='purple' className='font-weight-bold'>
                                {
                                    this.state.activePage < 2
                                        ?
                                        <MDBPageItem className='mx-1 paginate-item' disabled>
                                            <MDBPageNav aria-label="Previous">
                                                <span aria-hidden="true">Previous</span>
                                            </MDBPageNav>
                                        </MDBPageItem>
                                        :
                                        <MDBPageItem className='mx-1' onClick={() => this.pageChange('prev')}>
                                            <MDBPageNav aria-label="Previous">
                                                <span aria-hidden="true">Previous</span>
                                            </MDBPageNav>
                                        </MDBPageItem>
                                }

                                {
                                    this.state.activePage < 2
                                        ?
                                        null
                                        :
                                        <MDBPageItem className='px-3 py-1'>
                                            {this.state.activePage - 1}
                                        </MDBPageItem>
                                }

                                <MDBPageItem className='mx-1' active>
                                    <MDBPageNav>{this.state.activePage}</MDBPageNav>
                                </MDBPageItem>

                                {
                                    this.state.moviePoster.length < this.state.itemsPerPage || this.state.moviePoster.length / (this.state.activePage + 1) === this.state.itemsPerPage
                                        ?
                                        <MDBPageItem className='mx-1' disabled>
                                            <MDBPageNav aria-label="Previous">
                                                <span aria-hidden="true">Next</span>
                                            </MDBPageNav>
                                        </MDBPageItem>
                                        :
                                        <>
                                            <MDBPageItem className='px-3 py-1'>
                                                {this.state.activePage + 1}
                                            </MDBPageItem>
                                            <MDBPageItem className='mx-1' onClick={() => this.pageChange('next')}>
                                                <MDBPageNav aria-label="Previous">
                                                    <span aria-hidden="true">Next</span>
                                                </MDBPageNav>
                                            </MDBPageItem>
                                        </>
                                }
                            </MDBPagination>

                        </MDBCol>
                    </MDBRow>
                </div>
                {/* PAGINATION */}
            </div>
        )
    }
}

export default connect(null, { navItemChange })(allMovies)