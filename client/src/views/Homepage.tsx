import { Disclosure, Tab } from '@headlessui/react'
import React from 'react'

import AddConsignor from '../components/AddConsignor'
import AddConsignee from '../components/AddConsignee'
import AddDriver from '../components/AddDriver'
import AddTruck from '../components/AddTruck'

const Homepage: React.FC = () => {
	return (
		<div>
			<Tab.Group>
				<Tab.List>
					<Tab>Orders</Tab>
					<Tab>Reports</Tab>
					<Tab>Downloads</Tab>
					<Disclosure>
						<Disclosure.Button>Insert modules</Disclosure.Button>
						<Disclosure.Panel>
							<Tab>Add a consignor</Tab>
							<Tab>Add a consignee</Tab>
							<Tab>Add a truck</Tab>
							<Tab>Add a driver</Tab>
						</Disclosure.Panel>
					</Disclosure>
				</Tab.List>

				<Tab.Panels>
					<Tab.Panel>Tab 1</Tab.Panel>
					<Tab.Panel>Tab 2</Tab.Panel>
					<Tab.Panel>Tab 3</Tab.Panel>

					{/* insert modules */}
					<Tab.Panel>
						<AddConsignor />
					</Tab.Panel>
					<Tab.Panel>
						<AddConsignee />
					</Tab.Panel>
					<Tab.Panel>
						<AddTruck />
					</Tab.Panel>
					<Tab.Panel>
						<AddDriver />
					</Tab.Panel>
					{/* -------------- */}
				</Tab.Panels>
			</Tab.Group>
		</div>
	)
}

export default Homepage
