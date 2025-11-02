import React, { useState } from 'react'
import type { BouquetT } from '../types/bouquet.dto'

function Bouquet({ bouquet }: { bouquet: BouquetT }) {
    const [liked, setLiked] = useState(false);


    return (
        <div className="card" style={{ width: "18rem" }} key={bouquet.id}>
            <img src={bouquet.image} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{bouquet.nom}</h5>
                <p className="card-text">{bouquet.desc}.</p>
                <p className="card-text">{bouquet.prix} DA.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
            
            <a href="#" className="btn btn-primary " onClickCapture={() => setLiked(!liked)}>
                {liked ? "Unlike" : "Like"}
            </a>


        </div>
    )
}

export default Bouquet