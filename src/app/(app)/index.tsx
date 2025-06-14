import { OrderForm } from "@/views/OrderForm";

const App: React.FC = () => {
	return <OrderForm />;
};

export const Route = createFileRoute({
	component: App
});
