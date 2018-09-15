// react
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// redux
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';

// connect redux to react
import { connect, Provider } from 'react-redux';

// thunk middleware
import thunk from 'redux-thunk';

// actions
const actions = {
  saveComment(comment) {
    return {
      type: 'SAVE_COMMENT',
      payload: comment
    };
  }
};

// reducers
const initialCommentState = [];

const reducers = combineReducers({
  comments: (state = initialCommentState, action) => {
    switch (action.type) {
      case 'SAVE_COMMENT':
        return [...state, action.payload];
      default:
        return state;
    }
  }
});

// store
const initialAppState = {};

const store = createStore(
  reducers,
  initialAppState,
  process.env.NODE_ENV === 'development'
    ? compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )
    : compose(applyMiddleware(thunk))
);

// comment box component
class CommentBoxComponent extends Component {
  state = {
    comment: ''
  };

  onChange = e => {
    this.setState({
      comment: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    this.props.saveComment(this.state.comment);

    this.setState({ comment: '' });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Add a Comment</h1>
        <textarea value={this.state.comment} onChange={this.onChange} />
        <div>
          <button>Submit</button>
        </div>
      </form>
    );
  }
}

// comment list component
class CommentListComponent extends Component {
  renderComments() {
    return this.props.comments.map(comment => {
      return <li key={comment}>{comment}</li>;
    });
  }

  render() {
    return (
      <div>
        <h2>Comment List</h2>
        <ul>{this.renderComments()}</ul>
      </div>
    );
  }
}

// connect redux to react
const CommentBox = connect(
  null,
  actions
)(CommentBoxComponent);

const mapStateToProps = state => ({
  comments: state.comments
});

const CommentList = connect(mapStateToProps)(CommentListComponent);

// render react to DOM
ReactDOM.render(
  <Provider store={store}>
    <div>
      <CommentBox />
      <CommentList />
    </div>
  </Provider>,
  document.getElementById('root')
);
