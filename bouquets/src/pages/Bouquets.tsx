import React from 'react'
import Bouquet from '../components/Bouquet'
import type { BouquetDto } from '../types/bouquet.dto'

const Bouquets = ({ bouquets }: { bouquets: BouquetDto[] }) => {
	return (
		<div className="d-flex flex-wrap gap-3 justify-content-center">
			{bouquets.map((b: BouquetDto) =>
				<Bouquet bouquet={b} />
			)}
		</div>
	)
}

export default Bouquets