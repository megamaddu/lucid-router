import React from 'react';
import friends from '../db/friends'

const FriendInfo = ({location}) => {
  const friendId = location.state.name
  const friend = friends.find(f => f.id === friendId)
  return (
    <div>
      <h3>Friend info!</h3>
      <ul>
        <li>Name: {friend.name}</li>
        <li>Favorite food: {friend.favoriteFood}</li>
      </ul>
    </div>
  )
}

export default FriendInfo
