import React, { Component } from 'React';
import Comment from '../components/Comment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { loadCommentsForPage } from '../AC'
import { NavLink } from 'react-router-dom'
import Loader from '../components/Loader'

class CommentsPagination extends Component {

    static propTypes = {
    };

    componentWillMount() {
        this.checkAndLoad(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.checkAndLoad(nextProps);
    }

    checkAndLoad({ loading, comments, page, loadCommentsForPage }) {
        if (!loading && !comments) {
            loadCommentsForPage(page);
        }
    }

    render() {
        if (!this.props.total) return <Loader />;
        return (
            <div>
                {this.getCommentItems()}
                {this.getPaginator()}
            </div>
        );
    }

    getCommentItems() {
        const { comments, loading } = this.props;

        if (loading || !comments) return <Loader />;
        const commentItems = comments.map(id => (
            <li key={id}><Comment id={id} /></li>
        ));

        return (<ul>{commentItems}</ul>);
    }

    getPaginator() {
        const { total } = this.props;
        const items = [];

        for (let i = 1; i <= Math.floor((total - 1) / 5) + 1; i++) {
            items.push(<li key={i}><NavLink to={`/comments/${i}`} activeStyle={{color: 'red'}}>{i}</NavLink></li>)
        }

        return <ul>{items}</ul>
    }
}

export default connect((state, { page }) => {
    const {total, pagination} = state.comments;

    return {
        total,
        loading: pagination.getIn([page, 'loading']),
        comments: pagination.getIn([page, 'ids'])
    }
}, { loadCommentsForPage })(CommentsPagination);