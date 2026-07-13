import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import { QueryOptionsHolder } from '../app/src/utils/query-options-holder';
import { useSetAtom } from 'jotai';
import { AMenu } from '@/store/menu';
import { useEffect } from 'react';


const QMenuByName = new QueryOptionsHolder((trpc) => trpc.menu.byName.queryOptions)

export const Route = createFileRoute('/$name')({
	loader: async ({ context: { query, trpc }, params: { name } }) => {
			QMenuByName.init(trpc, name);
			query.ensureQueryData(QMenuByName.val)
	},
	component: MenuRedirector
})

function MenuRedirector() {
	const navigate = useNavigate();
	const setMenu = useSetAtom(AMenu);

	const { data:menu } = useSuspenseQuery(QMenuByName.val);

	useEffect(() => {
		if (menu) {
			setMenu(menu);
		}
	}, [menu, setMenu]);

	navigate({ to: `/menus/${menu.id}/${menu.ver}` });
}
