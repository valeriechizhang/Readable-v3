import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Modal from 'react-modal'

import { votePost, deletePost, loadSinglePost } from '../actions'
import { openPostModal, closePostModal } from '../actions'
import { push, goBack } from 'react-router-redux'

import * as Helper from '../utils/helper'
import * as API from '../utils/api'

class PostDetail extends Component {

    state = {
        post: {},
        deleteModalOpen: false
    }

    componentDidMount() {
        this.setState({ post: this.props.post })
    }


    vote = (option) => {
        API.votePost(this.state.post.id, option)
        this.props.votePost(this.state.post.id, option)
    }

    beginEdit = () => {
        this.props.loadSinglePost(this.state.post)
        this.props.openPostModal()
    }

    finalDelete = (postId) => {
        API.deletePost(postId)
        this.props.deletePost(postId)
        if (this.props.afterDelete) {
            this.props.push(this.props.afterDelete)
        }
    }

    openPostPage = (category, postId) => {
        this.props.push('/'+category+'/'+postId)
    }

    openDeleteModal = () => {
        this.setState({ deleteModalOpen: true })
    }

    closeDeleteModal = () => {
        this.setState({ deleteModalOpen: false })
    }


    render() {

        const { post } = this.state

        return (
            post && !post.deleted &&
                <div className='row post-overview'>
                    <div className='col-12'>
                        <h5 className='post-title'
                            onClick={()=>this.openPostPage(post.category, post.id)}>{post.title}</h5>
                        <div>Author: {post.author}</div>
                        <div>Category: {post.category}</div>
                        <div>Created on {Helper.formatDate(post.timestamp)}</div>
                        <div>Has {post.commentCount} comments</div>

                        <div className='post-operations'>
                            <button className='btn-op' onClick={this.beginEdit}>Edit</button>
                            <button className='btn-op' onClick={this.openDeleteModal}>Delete</button>
                        </div>

                        <p className='content'>{post.body}</p>
                        <div className='score'>
                            <div><p>Score: {post.voteScore} </p></div>
                            <button className='btn-vote' onClick={()=>{this.vote('upVote')}}>Upvote</button>
                            <button className='btn-vote' onClick={()=>{this.vote('downVote')}}>Downvote</button>
                        </div>
                        <div className='divider'><hr></hr></div>
                    </div>

                    <Modal className='delete-modal'
                        overlayClassName='overlay'
                        isOpen={this.state.deleteModalOpen}
                        onRequestClose={this.closeDeleteModal}
                    >
                        <div>
                            <h5>Are you sure you want to detele this?</h5>
                            <div className='center'>
                            <button className='btn-del' onClick={this.closeDeleteModal}>Go back</button>
                            <button className='btn-del' onClick={()=>this.finalDelete(this.state.post.id)}>Yes, delete!</button>
                            </div>
                        </div>

                    </Modal>
                </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        currPost: state.posts.post,
        posts: state.posts.posts,
        postModalOpen: state.posts.postModalOpen
    }
}

function mapDispatchToProps(dispatch) {
    return {
        votePost: (postId, option) => dispatch(votePost(postId, option)),
        loadSinglePost: (post) => dispatch(loadSinglePost(post)),
        deletePost: (postId) => dispatch(deletePost(postId)),
        openPostModal: () => dispatch(openPostModal()),
        closePostModal: () => dispatch(closePostModal()),
        push: (url) => dispatch(push(url)),
        goBack: () => dispatch(goBack())
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PostDetail));

