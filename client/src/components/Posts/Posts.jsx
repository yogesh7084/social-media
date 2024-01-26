import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import './Posts.css';
import Post from '../Post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { getTimelinePosts } from '../../actions/postAction';

const Posts = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.authReducer.authData);
    let { posts, loading } = useSelector((state) => state.postReducer);
    const params = useParams();

    useEffect(() => {
        dispatch(getTimelinePosts(user._id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!posts)
        return "No Posts yet";

    if (params.id)
        posts = posts.filter((post) => post.userId === user._id)
    return (
        <div className="Posts">
            {loading ? "Fetching posts..." :
                posts.map((post, id) => {
                    return <Post data={post} id={id} key={id} />
                })}
        </div>
    )
}

export default Posts