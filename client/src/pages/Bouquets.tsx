import React from 'react'
import Bouquet from '../components/Bouquet'
import type { BouquetT } from '../types/bouquet.dto'

const Bouquets = ({ bouquets }: { bouquets: BouquetT[] }) => {
	return (
		<div className="d-flex flex-wrap gap-3 justify-content-center">
			{bouquets.map((b: BouquetT) =>
				<Bouquet key={b.id} bouquet={b} />
			)}
		</div>
	)
}

export default Bouquets