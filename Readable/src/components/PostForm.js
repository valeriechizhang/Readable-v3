import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addPost, editPost, closePostModal } from '../actions'
import CloseIcon from 'react-icons/lib/fa/close'
import { Button } from 'react-bootstrap';

import * as Helper from '../utils/helper'
import * as API from '../utils/api'


class PostForm extends Component {

    state = {
        post: {},
        isEditing: false,
        errorMessage: false
    }

    setTitle = (title) => {
        this.setState({ post : Object.assign(this.state.post, { title:title })})
    }

    setAuthor = (author) => {
        this.setState({ post : Object.assign(this.state.post, { author:author })})
    }

    setCategory = (category) => {
        this.setState({ post : Object.assign(this.state.post, { category:category })})
    }

    setBody = (body) => {
        this.setState({ post : Object.assign(this.state.post, { body:body })})
    }

    setId = (id) => {
        this.setState({ post : Object.assign(this.state.post, { id: (id || Helper.createUUID()) })})
    }

    setTimestamp = () => {
        this.setState({ post : Object.assign(this.state.post, { timestamp: Date.now() })})
    }

    setScore = () => {
        this.setState({ post : Object.assign(this.state.post, { voteScore: 1 })})
    }

    formCheking = () => {
        const post = this.state.post
        if (!post.author || post.author.length === 0){
            return false
        }
        if (!post.title || post.title.length === 0) {
            return false
        }
        if (!post.body || post.title.length === 0) {
            return false
        }
        if (!post.category || post.category.length === 0 || post.category === 'none') {
            return false
        }
        return true
    }

    submitPost = () => {
        const { post, isEditing } = this.state
        if (!this.formCheking()) {
            this.setState({ errorMessage:true })
        } else {
            this.setState({ errorMessage:false })
            if (isEditing) {
                API.editPost(this.props.currPost.id,post.title,post.body)
                this.props.editPost(this.props.currPost.id,post.title,post.body)
            } else {
                this.setId()
                this.setTimestamp()
                this.setScore()
                API.addPost(post)
                this.props.addPost(post)
            }
            this.props.closePostModal()
        }
    }

    componentDidMount() {
        if (this.props.currPost) {
            this.setState({ isEditing: true })
            this.setTitle(this.props.currPost.title)
            this.setAuthor(this.props.currPost.author)
            this.setCategory(this.props.currPost.category)
            this.setBody(this.props.currPost.body)
        }
    }

    render() {
        const { categories } = this.props
        const { post, isEditing, errorMessage } = this.state

        return (
            <div>
                <div className='close-icon'>
                    <CloseIcon size={30} onClick={this.props.closePostModal}/>
                </div>
                <form>
                    <div>
                        <div><label>Title:</label></div>
                        <input type='text'
                            value={post.title?post.title:''}
                            onChange={(event)=>this.setTitle(event.target.value)}/>
                    </div>

                    <div>
                        <div><label>Username:</label></div>
                        <input type='text'
                            value={post.author?post.author:''}
                            disabled={isEditing}
                            onChange={(event)=>this.setAuthor(event.target.value)}/>
                    </div>

                    <div>
                        <div><label>Category:</label></div>
                        <select value={(post&&post.category)||''}
                            onChange={(event)=>this.setCategory(event.target.value)}
                            disabled={isEditing}>
                            <option value='' disabled>Select one...</option>
                            {categories && categories.map((cate) => (
                                <option key={cate.name} value={cate.name}>{cate.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div><label>Content:</label></div>
                        <textarea value={(post&&post.body)}
                            onChange={(event)=>this.setBody(event.target.value)}/>
                    </div>

                </form>

                <div className='error'>{errorMessage&&'Invalidate inputs'}</div>

                <div className='submit-post'>
                    <Button className='btn btn-outline-warning' onClick={this.submitPost}>Submit</Button>
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        categories: state.posts.categories,
        currPost: state.posts.post
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addPost: (post) => dispatch(addPost(post)),
        editPost: (postId, title, body) => dispatch(editPost(postId, title, body)),
        closePostModal: () => dispatch(closePostModal())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
