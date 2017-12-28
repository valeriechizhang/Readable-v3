import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import '../App.css'

import { closePostModal } from '../actions'

import PostList from './PostList'
import PostPage from './PostPage'
import PostForm from './PostForm'


const ConnectedSwitch = connect(state => ({
  location: state.location
}))(Switch)


class App extends Component {

    render() {
        return (
            <div>
                <ConnectedSwitch>
                    <Route exact path='/' component={PostList}/>
                    <Route exact path='/:category' component={PostList}/>
                    <Route exact path='/:category/:post_id' component={PostPage}/>
                    <Route component={PostList} />
                </ConnectedSwitch>

                <Modal className='edit-modal'
                    overlayClassName='overlay'
                    isOpen={this.props.postModalOpen}
                    onRequestClose={this.props.closePostModal}>
                    <PostForm />
                </Modal>

            </div>
        )
    }
}




function mapStateToProps (state) {
    return {
        postModalOpen: state.posts.postModalOpen,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        closePostModal: () => dispatch(closePostModal()),
    }
}




export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
