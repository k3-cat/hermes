import { createFileRoute } from '@tanstack/react-router'
import { QueryOptionsHolder } from '@/utils/query-options-holder';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Arches, Platforms, type PlatformNames } from '@/lib/platform-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { CaretRightIcon } from '@phosphor-icons/react';
import { PlatformLogo } from '@/components/PlatformLogo';
import { typedEntries } from '@/utils/typed-entries';

const QMenuItems = new QueryOptionsHolder((trpc) => trpc.menu.itemList.queryOptions)

export const Route = createFileRoute('/$menuName/$ver')({
	loader: async ({ context: { query, trpc }, params: { menuName } }) => {
		QMenuItems.init(trpc, menuName);
		query.ensureQueryData(QMenuItems.val)
},
  component: MenuDetail,
})

function MenuDetail() {
	const { menuName, ver } = Route.useParams();
	const { data: items } = useSuspenseQuery(QMenuItems.val);

	const itemsCollection = items.reduce((acc, curr) => {
		const key = Platforms[curr.platfrom];

		if (!(key in acc)) {
			acc[key] = [];
		}
		acc[key].push(curr);

		return acc;
	}, {} as Record<PlatformNames, typeof items>);

	return (
		<>
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{menuName} - {ver}</h1>
			<>
				{typedEntries(itemsCollection).map(([platformName, items]) =>
					<Card>
						<CardHeader>
							<PlatformLogo platformName={platformName} />
							<CardTitle>{platformName}</CardTitle>
						</CardHeader>
						<CardContent>
							<ItemGroup>
							{items.map((item) =>
								<Item variant="outline" size="sm" render={
									<a href="#/">
										<ItemContent>
											<ItemTitle>{Arches[item.arch]}</ItemTitle>
										</ItemContent>
										<ItemActions>
											<CaretRightIcon className="size-5" />
										</ItemActions>
									</a>
								} />
							)}
							</ItemGroup>
						</CardContent>
					</Card>
				)}
			</>
		</>
	)
}
