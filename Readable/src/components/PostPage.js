import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import GoBackIcon from 'react-icons/lib/fa/caret-left'

import { votePost, deletePost, loadSinglePost } from '../actions'
import { openPostModal, closePostModal } from '../actions'
import { push, goBack } from 'react-router-redux'
import { openCommentModal } from '../actions'
import { loadComments, loadSingleComment } from '../actions'

import PostDetail from './PostDetail'
import Comment from './Comment'
import CommentForm from './CommentForm'

import * as API from '../utils/api'


class PostPage extends Component {

    state = {
        post: null
    }

    componentDidMount() {
        API.fetchSinglePost(this.props.path[2])
            .then((response) => {
                console.log(response.id)
                if (response==='not found' || !response.id) {
                    this.props.push('/')
                } else {
                    this.props.loadSinglePost(response)
                    this.setState({post:response})
                }
            })

        this.loadComments()
    }


    loadComments = () => {
        const postId = this.props.path[2]
        API.fetchPostComments(postId)
            .then((response)=>{
                this.props.loadComments(response)
            })
    }

    beginAddComment = (post) => {
        this.props.loadSinglePost(post)
        this.props.loadSingleComment(null)
        this.props.openCommentModal()
    }

    render() {

        const { post } = this.state
        const { comments } = this.props

        return (
            (post && (
                <div className='App'>
                    <div className='container'>
                        <div className='go-back' onClick={this.props.goBack}>
                            <GoBackIcon size={30}/> Go back
                        </div>
                        <div className='post-list'>
                            <PostDetail postPage={true} afterDelete={'/'+this.props.path[1]}/>
                        </div>

                        <div className='row comment'>
                            <div className='col-12'>
                                <div className='comment-title center'>
                                    <h6>Comments</h6>
                                    <button className='btn-post-comment'
                                        onClick={()=>this.beginAddComment(post)}>
                                        Post a comment
                                    </button>
                                </div>

                                <div>
                                    {comments && comments.map((comment) => (
                                        <Comment key={comment.id}
                                            postId={post.id}
                                            commentId={comment.id}/>
                                    ))}
                                </div>
                            </div>
                        </div>


                        <Modal
                            className='edit-modal'
                            overlayClassName='overlay'
                            isOpen={this.props.commentModalOpen}
                            onRequestClose={this.props.closeCommentModal}
                        >
                            <div>
                                <CommentForm />
                            </div>
                        </Modal>
                    </div>
                </div>
        )))
    }

}


function mapStateToProps (state) {
    return {
        currPost: state.posts.post,
        posts: state.posts.posts,
        comments: state.posts.comments,
        postModalOpen: state.posts.postModalOpen,
        commentModalOpen: state.posts.commentModalOpen,
        path: state.route.location.pathname.split('/')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        votePost: (postId, option) => dispatch(votePost(postId, option)),
        loadSinglePost: (post) => dispatch(loadSinglePost(post)),
        deletePost: (postId) => dispatch(deletePost(postId)),
        openPostModal: () => dispatch(openPostModal()),
        closePostModal: () => dispatch(closePostModal()),
        openCommentModal: () => dispatch(openCommentModal()),
        loadComments: (comments) => dispatch(loadComments(comments)),
        loadSingleComment: (comment) => dispatch(loadSingleComment(comment)),
        push: (url) => dispatch(push(url)),
        goBack: () => dispatch(goBack())
    }
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PostPage));