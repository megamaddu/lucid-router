import React from 'react'
import Link from 'lucid-router/link'
import friends from '../db/friends'

const Friends = () =>
  <div>
    <h3>All the friends!</h3>
    <ul>
      {friends.map(friend =>
        <li key={friend.id}>
          <Link to="friends.info" params={{name: friend.id}}>{friend.name}</Link>
        </li>)}
    </ul>
  </div>

export default Friends
