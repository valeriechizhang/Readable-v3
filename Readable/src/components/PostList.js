import React, { Component } from 'react';
import { connect } from 'react-redux'
import sortBy from 'sort-by'
import { nav, Button, ButtonGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'

import { loadPosts, loadCategories, loadSinglePost } from '../actions'
import { openPostModal, closePostModal } from '../actions'
import { push } from 'react-router-redux'
import { loadComments } from '../actions'

import PostDetail from './PostDetail'

import * as API from '../utils/api'


class PostList extends Component {

    state = {
        category: null,
        sortAttr: 'timestamp'
    }


    componentDidMount() {
        this.loadCategories()
        const category = this.props.path
        this.setState({category})
        this.loadPostData(category)
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.path !== nextProps.path) {
            this.setState({category:nextProps.path})
            this.loadPostData(nextProps.path)
        }
    }

    loadCategories = () => {
        API.fetchCategories()
            .then((response)=>{
                this.props.loadCategories(response)
            })
    }

    loadPostData = (category) => {
        if (!category) {
            API.fetchPosts()
                .then((response)=>this.props.loadPosts(response))
        } else {
            API.fetchPostsByCategory(category)
                .then((response)=>{
                    if (response === 'not found') {
                        this.props.push('/')
                    } else {
                        this.props.loadPosts(response)
                    }
                })
        }
    }


    sortByTime = () => {
        this.setState({ sortAttr: 'timestamp' })
    }

    sortByVote = () => {
        this.setState({ sortAttr: 'voteScore'})
    }

    changeCate = (cate) => {
        this.props.push('/' + cate.path)
        this.setState({category:this.props.path})
    }

    beginNewPost = () => {
        this.props.loadSinglePost(null)
        this.props.openPostModal()
    }

    render() {

        const { categories, posts } = this.props
        const { category, sortAttr } = this.state

        posts.sort(sortBy(sortAttr)).reverse()

        return (
            <div className='App'>
                <div className='container'>
                    <nav className='navbar navbar-light bg-light'>
                        <ButtonGroup>
                            <Button className={(!category||category.length===0)
                                ?'btn-sm btn-category-selected':'btn-sm btn-category-unselected'}
                                onClick={()=>this.props.push('/')}>
                            All</Button>

                            {categories && (categories.map((cate)=>(
                                <Button key={cate.name} className={(cate.name===category)
                                    ?'btn-sm btn-category-selected':'btn-sm btn-category-unselected'}
                                    onClick={()=>this.changeCate(cate)}>
                                {cate.name}</Button>
                            )))}
                        </ButtonGroup>

                        <ButtonGroup>
                            <Button className={sortAttr==='timestamp'
                                ?'btn-sm btn-sort-selected':'btn-sm btn-sort-unselected'}
                                onClick={this.sortByTime}>Sort by Date</Button>
                            <Button className={sortAttr==='voteScore'
                                ?'btn-sm btn-sort-selected':'btn-sm btn-sort-unselected'}
                                onClick={this.sortByVote}>Sort by Vote</Button>
                        </ButtonGroup>

                        <div className='new-post'>
                            <Button className='btn btn-warning'
                                onClick={this.beginNewPost}>New Post</Button>
                        </div>
                    </nav>

                    <div className='post-list'>
                        {posts && (posts.map((post)=>(
                            <PostDetail key={post.id} post={post} postPage={false}/>
                        )))}
                    </div>

                </div>
            </div>
        )
    }
}



function mapStateToProps (state) {
    return {
        categories: state.posts.categories,
        posts: state.posts.posts,
        path: state.route.location.pathname.split('/')[1],
        currPost: state.posts.post
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadCategories: (categories) => dispatch(loadCategories(categories)),
        loadPosts: (posts) => dispatch(loadPosts(posts)),
        loadSinglePost: (post) => dispatch(loadSinglePost(post)),
        loadComments: (comments) => dispatch(loadComments(comments)),
        openPostModal: () => dispatch(openPostModal()),
        closePostModal: () => dispatch(closePostModal()),
        push: (url) => dispatch(push(url))
    }
}


export default withRouter(
    connect(mapStateToProps,mapDispatchToProps)(PostList));

