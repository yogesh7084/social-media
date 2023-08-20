import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unFollowUser } from '../../actions/UserAction';

const User = ({ person }) => {

    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useSelector((state) => state.authReducer.authData);
    const [following, setFollowing] = useState(user.following.includes(person._id))
    const dispatch = useDispatch();

    const handleFollow = () => {
        following ?
            dispatch(unFollowUser(person._id, user))
            :
            dispatch(followUser(person._id, user))
        setFollowing((prev) => !prev);
    }

    return (
        <div className="follower">
            <div>
                <img src={person.profilePicture ? serverPublic + person.profilePicture : serverPublic + "defaultProfile.png"} alt="follower-img"
                    className='followerImage' />
                <div className="name">
                    <span>{person.firstname + " " + person.lastname}</span>
                    <span>{person.username}</span>
                </div>
            </div>
            <button className={following ? 'button fc-button unfollowBtn' : 'button fc-button'} onClick={handleFollow}>
                {following ? "Unfollow" : "Follow"}
            </button>
        </div>
    )
}

export default User