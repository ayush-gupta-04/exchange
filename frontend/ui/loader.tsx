import React from 'react';

export default function Loader({side} : {side? : 'buy' | 'sell'}){
    return(
      <div
        className={`size-[28px] border-4  border-gray-300 rounded-full animate-spin ${side == undefined ?"border-t-blue-500": side == 'buy' ? "border-t-green-800" : "border-t-red-800"}`}
        ></div>
    )
}
