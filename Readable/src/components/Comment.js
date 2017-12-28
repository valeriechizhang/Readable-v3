import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

import { loadSingleComment } from '../actions'
import { addComment, voteComment, editComment, deleteComment } from '../actions'
import { openCommentModal } from '../actions'

import * as Helper from '../utils/helper'
import * as API from '../utils/api'


class Comment extends Component {
    static propTypes = {
        postId: PropTypes.string.isRequired,
        commentId: PropTypes.string.isRequired
    }

    state = {
        comment: {},
        deleteModalOpen: false
    }

    componentDidMount() {
        this.setState({
            comment:this.getComment(this.props.commentId)})
    }

    getComment = (commentId) => {
        for (var c of this.props.comments) {
            if (c.id === commentId) {
                return c
            }
        }
    }

    vote = (option) => {
        API.voteComment(this.state.comment.id, option)
        this.props.voteComment(
            this.state.comment.parentId,
            this.state.comment.id,
            option)
    }

    openDeleteModal = () => {
        this.setState({ deleteModalOpen: true })
    }

    closeDeleteModal = () => {
        this.setState({ deleteModalOpen: false })
    }

    beginEdit = (comment) => {
        this.props.loadSingleComment(comment)
        this.props.openCommentModal()
    }

    finalDelete = (postId, commentId) => {
        API.deleteComment(commentId)
        this.props.deleteComment(postId, commentId)
    }

    render() {
        const { postId, commentId } = this.props
        const { comment } = this.state

        return (
            <div className='comment-detail'>
                <div className='comment-author'>{comment.author}</div>
                <div className='comment-date'>{Helper.formatDate(comment.timestamp)}</div>
                <div className='comment-score'>Vote score: {comment.voteScore}</div>
                <div className='comment-body'>{comment.body}</div>
                <div>
                    <button className='btn-comment-op' onClick={()=>this.beginEdit(comment)}>Edit</button>
                    <button className='btn-comment-op' onClick={this.openDeleteModal}>Delete</button>
                    <button className='btn-comment-op' onClick={()=>this.vote('upVote')}>Upvote</button>
                    <button className='btn-comment-op' onClick={()=>this.vote('downVote')}>Downvote</button>
                </div>

                <div className='divider'><hr></hr></div>

                <Modal
                    className='delete-modal'
                    overlayClassName='overlay'
                    isOpen={this.state.deleteModalOpen}
                    onRequestClose={this.closeDeleteModal}
                    >
                    <div>
                        <h5>Are you sure you want to detele this comment?</h5>
                        <div className='center'>
                            <button className='btn-del' onClick={this.closeDeleteModal}>Go back</button>
                            <button className='btn-del' onClick={()=>this.finalDelete(postId, commentId)}>Yes, delete!</button>
                        </div>
                    </div>

                </Modal>
            </div>

        )
    }

}


function mapStateToProps (state) {
    return {
        posts: state.posts.posts,
        comments: state.posts.comments
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadSingleComment: (comment) => dispatch(loadSingleComment(comment)),
        voteComment: (postId, commentId, option) => dispatch(voteComment(postId, commentId, option)),
        editComment: (postId, commentId, timestamp, body) => dispatch(editComment(postId, commentId, timestamp, body)),
        deleteComment: (postId, commentId) => dispatch(deleteComment(postId, commentId)),
        addComment: (postId, comment) => dispatch(addComment),
        openCommentModal: () => dispatch(openCommentModal()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Comment);