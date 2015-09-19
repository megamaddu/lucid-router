import React from 'react';
import friends from '../db/friends'

export default class FriendInfo extends React.Component {
  render() {
    const friendId = this.props.location.state.name
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
}
