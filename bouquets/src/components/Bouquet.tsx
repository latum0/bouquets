import React from 'react'
import type { BouquetDto } from '../types/bouquet.dto'

function Bouquet({ bouquet }: { bouquet: BouquetDto }) {
    return (
        <div className="card" style={{ width: "18rem" }} key={bouquet.id}>
            <img src={bouquet.image} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{bouquet.nom}</h5>
                <p className="card-text">{bouquet.desc}.</p>
                <p className="card-text">{bouquet.prix} DA.</p>
                <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    )
}
export default Bouquet