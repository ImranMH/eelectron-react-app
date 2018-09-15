import React from 'react'

export default ({ items, handle}) => {
  return (
    <ul className="item_container">
      {
        items.map((item,i)=>{
         return <li onClick={handle} key ={i}> {item} </li>
        })
      }
    </ul>
  )
}
