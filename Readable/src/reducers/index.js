import * as type from '../actions'


const initialState = {
    categories: [],
    posts: [],
    post: null,
    comments: [],
    comment: null,
    postModalOpen: false,
    commentModalOpen: false
}


function postReducer(state=initialState, action) {
    switch(action.type) {
        case type.LOAD_CATEGORIES:
            return {
                ...state,
                categories: action.categories.categories
            }
        case type.LOAD_POSTS:
            return {
                ...state,
                posts: action.posts
            }
        case type.LOAD_SINGLE_POST:
            return {
                ...state,
                post: action.post
            }
        case type.VOTE_POST:
            return {
                ...state,
                posts: (state.posts.map((post) => {
                    if (post.id === action.postId) {
                        if (action.option === 'upVote') {
                            post.voteScore = post.voteScore+1
                        } else {
                            post.voteScore = post.voteScore-1
                        }
                    }
                    return post
                }))
            }
        case type.ADD_POST:
            return {
                ...state,
                posts: [
                    ...state.posts,
                    action.post
                ],
                newPostModalOpen: false
            }
        case type.EDIT_POST:
            return {
                ...state,
                post: Object.assign(state.post, {title:action.title, body:action.body}),
                posts: (state.posts.map((post) => {
                    if (post.id === action.postId) {
                        post.title = action.title
                        post.body = action.body
                    }
                    return post
                }))
            }
        case type.DELETE_POST:
            return {
                ...state,
                post: null,
                posts: state.posts.filter(post => post.id !== action.postId)
            }
        case type.LOAD_COMMENTS:
            return {
                ...state,
                comments: action.comments
            }
        case type.LOAD_SINGLE_COMMENT:
            return {
                ...state,
                comment: action.comment
            }
        case type.VOTE_COMMENT:
            return {
                ...state,
                comments: state.comments.map((comment)=>{
                        if (comment.id === action.commentId) {
                            if (action.option === 'upVote') {
                                comment.voteScore = comment.voteScore+1
                            } else {
                                comment.voteScore = comment.voteScore-1
                            }
                        }
                        return comment
                    }
                )
            }
        case type.ADD_COMMENT:
            return {
                ...state,
                comments: [
                    ...state.comments,
                    action.comment
                ],
                post: Object.assign(state.post, state.post.commentCount+1),
                posts: state.posts.map((post)=>{
                    if (post.id === action.postId) {
                        post.commentCount = post.commentCount+1
                    }
                    return post
                })
            }
        case type.EDIT_COMMENT:
            return {
                ...state,
                comments: state.comments.map((comment)=>{
                        if (comment.id === action.commentId) {
                            comment.timestamp = action.timestamp
                            comment.body = action.body
                        }
                        return comment
                    }
                )
            }
        case type.DELETE_COMMENT:
            return {
                ...state,
                comment: null,
                comments: state.comments.filter((comment) => comment.id !== action.commentId),
                post: Object.assign(state.post, state.post.commentCount-1),
                posts: state.posts.map((post)=>{
                    if (post.id === action.postId) {
                        post.commentCount = post.commentCount-1
                    }
                    return post
                })
            }
        case type.OPEN_POST_MODAL:
            return {
                ...state,
                commentModalOpen:false,
                postModalOpen: true
            }
        case type.CLOSE_POST_MODAL:
            return {
                ...state,
                postModalOpen: false
            }
        case type.OPEN_COMMENT_MODAL:
            return {
                ...state,
                postModalOpen: false,
                commentModalOpen: true
            }
        case type.CLOSE_COMMENT_MODAL:
            return {
                ...state,
                commentModalOpen: false
            }
        default:
            return state
    }
}

export default postReducer
